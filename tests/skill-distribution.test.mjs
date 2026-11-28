import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = path => readFileSync(join(root, path), "utf8");
const json = path => JSON.parse(read(path));
const skills = readdirSync(join(root, "skills"), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name);
const orchestrator = "seo-orchestrator";

test("skill directories expose matching discovery metadata and appear in the orchestrator", () => {
  for (const skill of skills) {
    assert.match(skill, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(skill.length <= 64, skill);
    const path = `skills/${skill}/SKILL.md`;
    // The repository uses a name and a folded block description in every skill.
    const frontmatter = read(path).match(/^---\r?\nname: ([a-z0-9-]+)\r?\ndescription: >-\r?\n((?:  [^\r\n]+\r?\n)+)---\r?\n/);
    assert.ok(frontmatter, `${path}: expected name and folded description in frontmatter`);
    assert.equal(frontmatter[1], skill, path);
    const description = frontmatter[2].trim().replace(/\s+/g, " ");
    assert.ok(description.length > 0 && [...description].length <= 1024, `${path}: description must contain 1–1024 characters`);
  }

  const rows = [...read(`skills/${orchestrator}/SKILL.md`).matchAll(/^\| `([a-z0-9-]+)` \|/gm)]
    .map(match => match[1]).sort();
  assert.deepEqual(rows, skills.filter(skill => skill !== orchestrator).sort());
});

test("Claude marketplace points to the local plugin and shares the npm release version", () => {
  const plugin = json(".claude-plugin/plugin.json");
  const marketplace = json(".claude-plugin/marketplace.json");
  const pkg = json("package.json");
  assert.match(plugin.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.match(marketplace.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(marketplace.owner.name?.trim(), "marketplace owner name is required");
  const entries = marketplace.plugins.filter(entry => entry.name === plugin.name);
  assert.equal(entries.length, 1, "marketplace must list the local plugin exactly once");
  const [entry] = entries;
  assert.equal(entry.source, "./", "marketplace plugin source must resolve to the checkout root");
  assert.equal(plugin.skills, "./skills");
  assert.equal(plugin.version, pkg.version);
  assert.equal(marketplace.metadata.version, pkg.version);
  if ("version" in entry) assert.equal(entry.version, pkg.version);
  const repository = pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");
  assert.equal(plugin.repository, repository);
  assert.equal(marketplace.metadata.repository, repository);
  for (const description of [plugin.description, marketplace.metadata.description, entry.description]) {
    assert.equal(typeof description, "string");
    assert.ok(description.trim());
  }
});

test("documented skill commands run from an individually installed skill", t => {
  const pkg = json("package.json");
  const visibility = `skills/${orchestrator}/scripts/visibility.mjs`;
  const audit = `skills/${orchestrator}/scripts/seo-check.mjs`;
  assert.equal(pkg.bin["search-visibility"], visibility);
  assert.equal(pkg.bin["seo-check"], audit);
  assert.equal(pkg.scripts.visibility, `node ${visibility}`);
  assert.equal(pkg.scripts.check, `node ${audit}`);

  const cwd = mkdtempSync(join(tmpdir(), "visibility-skill-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  symlinkSync(join(root, "skills", orchestrator, "scripts"), join(cwd, "scripts"), "junction");
  mkdirSync(join(cwd, "out", "events"), { recursive: true });
  writeFileSync(join(cwd, "out/events/123.html"), "<!doctype html><title>Skill command smoke test</title>");
  writeFileSync(join(cwd, "config.json"), '{"targets":["out/events/123.html"]}');

  // Check config and comparison examples in their documented sequence.
  const tested = new Set();
  for (const skill of [orchestrator, ...skills.filter(name => name !== orchestrator)]) {
    const path = `skills/${skill}/SKILL.md`;
    const markdown = read(path);
    for (const line of markdown.split(/\r?\n/)) {
      const normalized = line.replace(/<(?:skill|seo-orchestrator) 폴더>\//g, "");
      for (const [reference] of normalized.matchAll(/[^\s`(<>"']+\.mjs\b/g)) {
        const script = reference.startsWith("scripts/") ? `${orchestrator}/${reference}` : reference;
        assert.match(script, /^[a-z0-9-]+\/scripts\/[a-z0-9-]+\.mjs$/, `${path}: ${reference}`);
        assert.ok(statSync(join(root, "skills", script), { throwIfNoEntry: false })?.isFile(), `${path}: missing ${script}`);
      }
      for (const [, example] of normalized.matchAll(/\bnode ([^`#\r\n]*\.mjs[^`#\r\n]*)/g)) {
        const [script, ...args] = example.trim().split(/\s+/);
        assert.ok([`scripts/visibility.mjs`, `scripts/seo-check.mjs`].includes(script), `${path}: ${script}`);
        const isVisibility = `skills/${orchestrator}/${script}` === visibility;
        // Use local fixtures for documented placeholders and public example URLs.
        // URL fetching itself is covered by the visibility and SEO audit tests.
        const localArgs = args.map(arg => {
          if (/^https:\/\/example\.(?:com|org)(?:\/|$)/.test(arg)) {
            return isVisibility ? "config.json" : "out/events/123.html";
          }
          assert.doesNotMatch(arg, /:\/\//, `${path}: use an example.com or example.org URL in executable examples`);
          if (arg === "/절대/경로/config.json") return join(cwd, "config.json");
          return arg;
        });
        if (isVisibility && !["init", "compare"].includes(args[0])) {
          localArgs.push("--out", tested.has("report") ? "after" : "before");
        }
        const run = spawnSync(process.execPath, [script, ...localArgs], { cwd, encoding: "utf8", timeout: 10_000 });
        assert.ifError(run.error);
        assert.equal(run.status, isVisibility ? 0 : 1, `${path}: node ${example}\n${run.stderr}`);
        if (isVisibility) {
          const result = args[0] === "init" ? "visibility.config.json"
            : args[0] === "compare" ? "diff/report.json"
            : tested.has("report") ? "after/report.json" : "before/report.json";
          assert.ok(statSync(join(cwd, result), { throwIfNoEntry: false })?.isFile(), `${path}: missing ${result}`);
          tested.add(args[0] === "init" || args[0] === "compare" ? args[0] : "report");
        } else if (args.includes("--json")) {
          assert.ok(JSON.parse(run.stdout).results.length > 0, path);
          tested.add("audit-json");
        } else {
          assert.match(run.stdout, /(?:점검|Audit)/, path);
          tested.add("audit-text");
        }
      }
    }
  }
  assert.deepEqual([...tested].sort(), ["audit-json", "audit-text", "compare", "init", "report"]);
});
