import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

test("the npm tarball installs both executable commands outside the checkout", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "search-visibility-package-"));
  try {
    const npm = (args, directory = cwd) => execFileSync(
      process.env.npm_execpath ? process.execPath : "npm",
      [...(process.env.npm_execpath ? [process.env.npm_execpath] : []), ...args],
      { cwd: directory, encoding: "utf8" },
    );
    const [pack] = JSON.parse(npm(["pack", "--json", "--pack-destination", cwd], root));
    assert.equal(pack.name, "search-visibility");
    assert.ok(pack.files.some(({ path }) => path === "CHANGELOG.md"));
    for (const { path } of pack.files) {
      assert.match(path, /^(?:LICENSE|CHANGELOG\.md|README(?:\.en)?\.md|package\.json|skills\/seo-orchestrator\/scripts\/[^/]+\.mjs)$/);
    }
    await writeFile(join(cwd, "package.json"), '{"private":true}');
    npm(["install", "--offline", "--ignore-scripts", "--no-audit", "--no-fund", join(cwd, pack.filename)]);
    const run = (command, args) => spawnSync(
      join(cwd, "node_modules", ".bin", command + (process.platform === "win32" ? ".cmd" : "")),
      args,
      { cwd, encoding: "utf8", shell: process.platform === "win32" },
    );
    const init = run("search-visibility", ["init", "starter.json", "--lang", "en"]);
    assert.equal(init.status, 0, init.stderr);
    assert.equal(JSON.parse(await readFile(join(cwd, "starter.json"), "utf8")).locale, "en");
    await writeFile(join(cwd, "page.html"), "<!doctype html><title>Package smoke</title>");
    const audit = run("seo-check", ["page.html", "--json"]);
    assert.equal(audit.status, 1, audit.stderr);
    assert.ok(JSON.parse(audit.stdout).results.some(({ item, level }) => item === "og:image" && level === "FAIL"));
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});
