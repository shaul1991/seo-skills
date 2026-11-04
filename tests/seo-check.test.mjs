import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { run, robotsBlocksRoot, imageSize } from "../skills/seo-orchestrator/scripts/seo-check.mjs";

const fx = (n) => fileURLToPath(new URL(`./fixtures/${n}`, import.meta.url));
const has = (r, level, item) => r.results.some((x) => x.level === level && x.item === item);

test("good fixture has no FAIL", async () => {
  const r = await run(fx("good.html"));
  const fails = r.results.filter((x) => x.level === "FAIL");
  assert.deepEqual(fails, []);
  assert.ok(r.results.some((x) => x.item === "유형" && /Event/.test(x.detail) && /BreadcrumbList/.test(x.detail)));
});

test("bad fixture catches the planted problems", async () => {
  const r = await run(fx("bad.html"));
  for (const [level, item] of [
    ["WARN", "<title> 반복"], ["WARN", "meta description"], ["WARN", "canonical"], ["WARN", "<html lang>"], ["WARN", "viewport"],
    ["WARN", "파비콘"], ["FAIL", "소유 확인"], ["WARN", "서버 HTML 본문"], ["WARN", "fragment 링크"], ["WARN", "javascript: 링크"],
    ["FAIL", "og:title"], ["FAIL", "og:image"], ["WARN", "twitter:card"], ["FAIL", "JSON-LD #2"], ["WARN", "Event.startDate"],
    ["FAIL", "Event.location.address"], ["WARN", "Event.name"], ["WARN", "<h1>"],
  ]) assert.ok(has(r, level, item), `expected ${level} ${item}`);
});

test("robots.txt group matching", () => {
  const txt = "User-agent: *\nDisallow: /\n\nUser-agent: Yeti\nAllow: /\n";
  assert.equal(robotsBlocksRoot(txt, "Googlebot"), true);
  assert.equal(robotsBlocksRoot(txt, "Yeti"), false);
  assert.equal(robotsBlocksRoot("User-agent: *\nDisallow: /\nAllow: /$\n", "Googlebot"), false);
  assert.equal(robotsBlocksRoot("User-agent: *\nDisallow: /admin/\n", "Twitterbot"), false);
});

test("robots.txt specificity and Applebot fallback", () => {
  const txt = "User-agent: Googlebot\nDisallow: /\n\nUser-agent: *\nAllow: /\n";
  assert.equal(robotsBlocksRoot(txt, "Applebot"), true, "Applebot follows Googlebot when no Applebot group");
  assert.equal(robotsBlocksRoot(txt + "\nUser-agent: Applebot\nAllow: /\n", "Applebot"), false);
  const ai = "User-agent: Applebot-Extended\nDisallow: /\n\nUser-agent: *\nAllow: /\n";
  assert.equal(robotsBlocksRoot(ai, "Applebot-Extended"), true);
  assert.equal(robotsBlocksRoot(ai, "Applebot"), false, "Applebot-Extended group must not apply to Applebot");
  const tr = "User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n";
  assert.equal(robotsBlocksRoot(tr, "GPTBot"), true);
  assert.equal(robotsBlocksRoot(tr, "OAI-SearchBot"), false, "blocking GPTBot must not block OAI-SearchBot");
  assert.equal(robotsBlocksRoot(tr, "ChatGPT-User"), false);
  const ms = "User-Agent: __usage_ai-training\nDisallow: /\n";
  assert.equal(robotsBlocksRoot(ms, "__usage_ai-training"), true);
});

test("Bing noarchive transition warning", async () => {
  const { writeFile, mkdtemp } = await import("node:fs/promises");
  const { tmpdir } = await import("node:os");
  const dir = await mkdtemp(`${tmpdir()}/seo-`);
  const f = `${dir}/p.html`;
  await writeFile(f, '<html lang="ko"><head><title>t</title><meta name="robots" content="noarchive"><meta name="Bingbot" content="ai-training:disallow"></head><body></body></html>');
  const r = await run(f);
  assert.ok(has(r, "WARN", "noarchive/nocache"));
  assert.ok(r.results.some((x) => x.item === "AI 설정" && /ai-training:disallow/.test(x.detail)));
});

test("robotsDecision reports where the rule came from", async () => {
  const { robotsDecision } = await import("../skills/seo-orchestrator/scripts/seo-check.mjs");
  const preview = "User-Agent: *\nDisallow: /\n";
  assert.deepEqual(robotsDecision(preview, "OAI-SearchBot"), { blocked: true, via: "*" });
  assert.deepEqual(robotsDecision("User-agent: Googlebot\nDisallow: /\n", "Applebot"), { blocked: true, via: "fallback" });
  assert.deepEqual(robotsDecision("User-agent: GPTBot\nDisallow: /\n", "GPTBot"), { blocked: true, via: "own" });
  assert.deepEqual(robotsDecision("", "GPTBot"), { blocked: false, via: null });
});

test("image size parsing", () => {
  const png = Buffer.alloc(33); png.writeUInt32BE(0x89504e47, 0); png.writeUInt32BE(1200, 16); png.writeUInt32BE(630, 20);
  assert.deepEqual(imageSize(png), { type: "png", w: 1200, h: 630 });
  const gif = Buffer.from("GIF89a\x10\x00\x20\x00", "latin1");
  assert.deepEqual(imageSize(Buffer.concat([gif, Buffer.alloc(4)])), { type: "gif", w: 16, h: 32 });
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x02, 0x76, 0x04, 0xb0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(imageSize(jpg), { type: "jpeg", w: 1200, h: 630 });
});
