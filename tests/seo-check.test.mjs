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

test("image size parsing", () => {
  const png = Buffer.alloc(33); png.writeUInt32BE(0x89504e47, 0); png.writeUInt32BE(1200, 16); png.writeUInt32BE(630, 20);
  assert.deepEqual(imageSize(png), { type: "png", w: 1200, h: 630 });
  const gif = Buffer.from("GIF89a\x10\x00\x20\x00", "latin1");
  assert.deepEqual(imageSize(Buffer.concat([gif, Buffer.alloc(4)])), { type: "gif", w: 16, h: 32 });
  const jpg = Buffer.from([0xff, 0xd8, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x02, 0x76, 0x04, 0xb0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  assert.deepEqual(imageSize(jpg), { type: "jpeg", w: 1200, h: 630 });
});
