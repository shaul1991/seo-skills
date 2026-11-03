#!/usr/bin/env node
// seo-check: 단일 페이지의 검색·공유 마크업 점검 (Google, 네이버, Open Graph, X, JSON-LD).
// 의존성 없음. Node 18+.
//   node scripts/seo-check.mjs <URL | HTML 파일> [--json]
// 순위·색인 여부·JS 렌더링 결과는 알 수 없습니다. 서버가 준 HTML만 봅니다.

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const UA = "seo-skills-check/0.1 (+https://github.com/shaul1991/seo-skills)";

// ---------- HTML 파싱(정규식, 의존성 없음) ----------

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

function parseAttrs(tag) {
  const attrs = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  const body = tag.replace(/^<\s*[a-zA-Z0-9-]+/, "").replace(/\/?>$/, "");
  let m;
  while ((m = re.exec(body))) attrs[m[1].toLowerCase()] = decodeEntities(m[3] ?? m[4] ?? m[5] ?? "");
  return attrs;
}

export function parseHtml(html) {
  const noComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const tags = (name) => [...noComments.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((m) => parseAttrs(m[0]));
  const meta = {};
  for (const a of tags("meta")) {
    const key = (a.property || a.name || "").toLowerCase();
    if (key && a.content !== undefined && !(key in meta)) meta[key] = a.content.trim();
  }
  const links = tags("link");
  const rel = (r) => links.filter((l) => (l.rel || "").toLowerCase().split(/\s+/).includes(r));
  const titleMatch = noComments.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const htmlTag = noComments.match(/<html\b[^>]*>/i);
  const jsonLd = [...noComments.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1].trim());
  const anchors = tags("a").map((a) => a.href).filter((h) => h !== undefined);
  const bodyText = noComments
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<head\b[\s\S]*?<\/head>/i, " ").replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ").trim();
  const h1 = [...noComments.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const headBlock = (noComments.match(/<head\b[\s\S]*?<\/head>/i) || [""])[0];
  const verificationInBody = /naver-site-verification/i.test(noComments.replace(headBlock, ""));
  return {
    title: titleMatch ? decodeEntities(titleMatch[1].replace(/\s+/g, " ").trim()) : null,
    lang: htmlTag ? parseAttrs(htmlTag[0]).lang ?? null : null,
    meta,
    canonical: rel("canonical")[0]?.href ?? null,
    icons: [...rel("icon"), ...rel("apple-touch-icon"), ...rel("apple-touch-icon-precomposed")].map((l) => l.href).filter(Boolean),
    jsonLd,
    anchors,
    bodyTextLength: bodyText.length,
    h1,
    verificationInBody,
  };
}

// ---------- JSON-LD ----------

function flattenLd(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => flattenLd(n, out));
  else if (node && typeof node === "object") {
    if (node["@graph"]) flattenLd(node["@graph"], out);
    if (node["@type"]) out.push(node);
  }
  return out;
}

const typesOf = (n) => [].concat(n["@type"] || []).map(String);

function checkDate(value, field, add) {
  if (typeof value !== "string") return add("FAIL", "구조화 데이터", `Event.${field}`, `${field}가 문자열이 아님`, "structured-data");
  if (!/^\d{4}-\d{2}-\d{2}/.test(value)) return add("FAIL", "구조화 데이터", `Event.${field}`, `ISO-8601 아님: ${value}`, "structured-data");
  if (/T00:00(:00)?/.test(value)) add("WARN", "구조화 데이터", `Event.${field}`, `자정(T00:00)으로 채운 값: ${value}. 시간을 모르면 날짜만 쓰기`, "structured-data");
  else if (/T\d{2}:\d{2}/.test(value) && !/(Z|[+-]\d{2}:?\d{2})$/.test(value)) add("WARN", "구조화 데이터", `Event.${field}`, `시간에 UTC 오프셋 없음: ${value} (예: +09:00)`, "structured-data");
}

export function checkJsonLd(blocks, add) {
  const nodes = [];
  blocks.forEach((raw, i) => {
    try { flattenLd(JSON.parse(raw), nodes); }
    catch (e) { add("FAIL", "구조화 데이터", `JSON-LD #${i + 1}`, `JSON 파싱 실패: ${String(e.message).slice(0, 80)}`, "structured-data"); }
  });
  if (!blocks.length) add("INFO", "구조화 데이터", "JSON-LD", "없음", "structured-data");
  else add("INFO", "구조화 데이터", "유형", [...new Set(nodes.flatMap(typesOf))].join(", ") || "(@type 없음)", "structured-data");

  for (const n of nodes) {
    const t = typesOf(n);
    if (t.some((x) => /Event$/.test(x))) {
      if (!n.name) add("FAIL", "구조화 데이터", "Event.name", "필수 속성 없음", "structured-data");
      if (!n.startDate) add("FAIL", "구조화 데이터", "Event.startDate", "필수 속성 없음", "structured-data");
      else checkDate(n.startDate, "startDate", add);
      if (n.endDate) checkDate(n.endDate, "endDate", add);
      const loc = [].concat(n.location || [])[0];
      if (!loc) add("FAIL", "구조화 데이터", "Event.location", "필수 속성 없음", "structured-data");
      else {
        if (!loc.name) add("WARN", "구조화 데이터", "Event.location.name", "장소 이름 없음", "structured-data");
        if (!loc.address) add("FAIL", "구조화 데이터", "Event.location.address", "주소 없음(Google 필수)", "structured-data");
      }
      if (n.name && loc?.name && String(n.name).trim() === String(loc.name).trim()) add("WARN", "구조화 데이터", "Event.name", "행사명이 장소명과 같음", "structured-data");
      if (!n.eventStatus) add("INFO", "구조화 데이터", "Event.eventStatus", "없음 → Google은 EventScheduled로 간주", "structured-data");
      if (!n.image) add("WARN", "구조화 데이터", "Event.image", "권장 속성 없음", "structured-data");
    }
    if (t.includes("BreadcrumbList")) {
      const items = [].concat(n.itemListElement || []);
      if (!items.length) add("FAIL", "구조화 데이터", "BreadcrumbList", "itemListElement 없음", "structured-data");
      for (const it of items) {
        const name = it.name ?? it.item?.name;
        if (!name) add("FAIL", "구조화 데이터", "BreadcrumbList.name", "name 없음(네이버 필수)", "structured-data");
        else if (/^(홈|home|top)$/i.test(String(name).trim())) add("WARN", "구조화 데이터", "BreadcrumbList.name", `일반어 "${name}" — 네이버는 페이지를 설명하는 이름 권장`, "structured-data");
      }
    }
    if ((t.includes("Organization") || t.includes("Person")) && n.sameAs !== undefined) {
      if (!n.name || !n.url) add("WARN", "구조화 데이터", `${t[0]}.sameAs`, "네이버 연관채널은 name·url·sameAs 필수", "structured-data");
    }
    if (t.includes("WebSite") && !n.name) add("WARN", "구조화 데이터", "WebSite.name", "사이트 이름 없음", "structured-data");
  }
  const events = nodes.filter((n) => typesOf(n).some((x) => /Event$/.test(x)));
  if (events.length > 1) add("WARN", "구조화 데이터", "Event 개수", `${events.length}개 — Google 이벤트 환경은 한 이벤트에 집중한 상세(리프) 페이지만 지원. 목록 페이지는 ItemList 권장`, "structured-data");
  if (events.length) add("INFO", "구조화 데이터", "Event 지역", "Google 이벤트 검색 환경 제공 지역에 한국 없음(2026-11-04 확인). 네이버 Event 가이드 없음", "structured-data");
  return nodes;
}

// ---------- 이미지 크기 ----------

export function imageSize(buf) {
  const b = buf;
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { type: "png", w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  if (b.length > 10 && b.toString("ascii", 0, 3) === "GIF") return { type: "gif", w: b.readUInt16LE(6), h: b.readUInt16LE(8) };
  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { type: "webp", w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { type: "webp", w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") { const v = b.readUInt32LE(21); return { type: "webp", w: (v & 0x3fff) + 1, h: ((v >> 14) & 0x3fff) + 1 }; }
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { type: "jpeg", w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

// ---------- 네트워크 ----------

async function fetchFollow(url, max = 5) {
  const chain = [];
  let cur = url;
  for (let i = 0; i <= max; i++) {
    const res = await fetch(cur, { redirect: "manual", headers: { "user-agent": UA, accept: "text/html,*/*" } });
    chain.push({ url: cur, status: res.status });
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) { cur = new URL(loc, cur).href; continue; }
    return { res, chain, finalUrl: cur };
  }
  throw new Error(`리다이렉트 ${max}회 초과`);
}

function robotsGroups(txt) {
  const groups = [];
  let cur = null;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([a-zA-Z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const [, k, v] = m;
    const key = k.toLowerCase();
    if (key === "user-agent") {
      if (!cur || cur.rules.length) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(v.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && cur) cur.rules.push({ type: key, path: v });
  }
  return groups;
}

export function robotsBlocksRoot(txt, agent) {
  const groups = robotsGroups(txt);
  const a = agent.toLowerCase();
  const g = groups.find((x) => x.agents.some((n) => n !== "*" && a.includes(n))) || groups.find((x) => x.agents.includes("*"));
  if (!g) return false;
  const disallowAll = g.rules.some((r) => r.type === "disallow" && r.path === "/");
  const allowRoot = g.rules.some((r) => r.type === "allow" && (r.path === "/" || r.path === "/$"));
  return disallowAll && !allowRoot;
}

// ---------- 메인 점검 ----------

export function checkPage(p, add, baseUrl) {
  const abs = (u) => /^https?:\/\//i.test(u || "");
  // 제목
  if (!p.title) add("FAIL", "공통", "<title>", "없음", "google-search");
  else {
    add("INFO", "공통", "<title>", `${p.title} (${[...p.title].length}자)`, "google-search");
    const words = p.title.toLowerCase().split(/[\s|·,:\-–—]+/).filter((w) => w.length > 1);
    const rep = Object.entries(words.reduce((m, w) => ((m[w] = (m[w] || 0) + 1), m), {})).filter(([, c]) => c >= 2);
    if (rep.length) add("WARN", "공통", "<title> 반복", `반복 단어: ${rep.map(([w, c]) => `${w}×${c}`).join(", ")} (네이버: 2회 이상 반복 불이익 가능)`, "naver-search");
    if (/^(홈|home|상세|detail|untitled)$/i.test(p.title.trim())) add("WARN", "공통", "<title>", "모호한 제목", "google-search");
  }
  // 설명
  const desc = p.meta["description"];
  if (!desc) add("WARN", "공통", "meta description", "없음", "google-search");
  else {
    add("INFO", "공통", "meta description", `${[...desc].length}자`, "google-search");
    if (p.title && desc.trim() === p.title.trim()) add("WARN", "공통", "meta description", "제목과 동일(네이버 불이익 사례)", "naver-search");
  }
  if (p.h1.length === 0) add("WARN", "공통", "<h1>", "없음 — 페이지 기본 제목이 분명해야 함", "google-search");
  else if (p.h1.length > 1) add("INFO", "공통", "<h1>", `${p.h1.length}개`, "google-search");
  // canonical
  if (!p.canonical) add("WARN", "공통", "canonical", "없음", "google-search");
  else {
    if (!abs(p.canonical)) add("WARN", "공통", "canonical", `상대 경로: ${p.canonical}`, "google-search");
    if (baseUrl && abs(p.canonical) && new URL(p.canonical).href !== new URL(baseUrl).href) add("INFO", "공통", "canonical", `다른 URL을 가리킴: ${p.canonical}`, "google-search");
  }
  // robots meta
  const robots = [p.meta["robots"], p.meta["googlebot"], p.meta["yeti"]].filter(Boolean).join(", ");
  if (/noindex/i.test(robots)) add("WARN", "공통", "robots meta", `noindex 있음: ${robots}`, "google-search");
  else if (robots) add("INFO", "공통", "robots meta", robots, "google-search");
  if (/nosourceinfo/i.test(robots)) add("INFO", "네이버", "nosourceinfo", "네이버 AI 출처설명 제외 설정됨", "naver-search");
  // 기본
  if (!p.lang) add("WARN", "공통", "<html lang>", "없음", "google-search");
  if (!p.meta["viewport"]) add("WARN", "공통", "viewport", "없음(모바일)", "naver-search");
  if (!p.icons.length) add("WARN", "네이버", "파비콘", "<link rel=icon> 없음", "naver-search");
  else if (!p.icons.every(abs)) add("WARN", "네이버", "파비콘", `절대 경로 아님: ${p.icons.filter((u) => !abs(u)).join(", ")} (네이버는 절대 경로 요구)`, "naver-search");
  if (p.verificationInBody) add("FAIL", "네이버", "소유 확인", "naver-site-verification이 <head> 밖에 있음", "naver-search");
  else if (p.meta["naver-site-verification"]) add("INFO", "네이버", "소유 확인", "meta 있음", "naver-search");
  // 본문·링크
  if (p.bodyTextLength < 200) add("WARN", "공통", "서버 HTML 본문", `텍스트 ${p.bodyTextLength}자 — 클라이언트 렌더링이면 검색로봇이 본문을 못 볼 수 있음`, "google-search");
  const hashLinks = p.anchors.filter((h) => /^#\/|^#!/.test(h));
  const jsLinks = p.anchors.filter((h) => /^javascript:/i.test(h));
  if (hashLinks.length) add("WARN", "공통", "fragment 링크", `${hashLinks.length}개(#/ 또는 #!) — Google·네이버 모두 별도 페이지로 보지 않음`, "naver-search");
  if (jsLinks.length) add("WARN", "공통", "javascript: 링크", `${jsLinks.length}개`, "naver-search");
  add("INFO", "공통", "<a href>", `${p.anchors.length}개`, "google-search");
  // Open Graph
  for (const k of ["og:type", "og:title", "og:description", "og:image", "og:url"]) {
    if (!p.meta[k]) add(k === "og:description" ? "WARN" : "FAIL", "공유", k, "없음", "social-preview");
  }
  if (p.meta["og:image"] && !abs(p.meta["og:image"])) add("FAIL", "공유", "og:image", `절대 URL 아님: ${p.meta["og:image"]}`, "social-preview");
  if (p.meta["og:url"] && p.canonical && abs(p.canonical) && p.meta["og:url"] !== p.canonical) add("WARN", "공유", "og:url", `canonical과 다름 (${p.meta["og:url"]} ≠ ${p.canonical})`, "social-preview");
  if (!p.meta["og:site_name"]) add("INFO", "공유", "og:site_name", "없음(Google 사이트 이름·공유에 사용)", "social-preview");
  // X
  if (!p.meta["twitter:card"]) add("WARN", "X", "twitter:card", "없음 — X 카드 유형을 지정하지 않음", "social-preview");
  else if (!["summary", "summary_large_image", "app", "player"].includes(p.meta["twitter:card"])) add("WARN", "X", "twitter:card", `알 수 없는 값: ${p.meta["twitter:card"]}`, "social-preview");
  if (p.meta["twitter:card"] && !p.meta["twitter:title"] && !p.meta["og:title"]) add("FAIL", "X", "twitter:title", "없음(og:title도 없음)", "social-preview");
  const xImg = p.meta["twitter:image"] || p.meta["og:image"];
  if (p.meta["twitter:image"] && !abs(p.meta["twitter:image"])) add("FAIL", "X", "twitter:image", "절대 URL 아님", "social-preview");
  return { ogImage: p.meta["og:image"], xImg };
}

async function checkImage(url, add) {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return add("FAIL", "공유", "og:image 응답", `HTTP ${res.status}`, "social-preview");
    const buf = Buffer.from(await res.arrayBuffer());
    const size = imageSize(buf);
    const kb = (buf.length / 1024).toFixed(1);
    add("INFO", "공유", "og:image", `${size ? `${size.type} ${size.w}×${size.h}` : "크기 판별 불가"}, ${kb}KB`, "social-preview");
    if (buf.length < 5000) add("WARN", "네이버", "og:image 용량", `${buf.length}바이트 < 5,000 (네이버 썸네일 조건)`, "naver-search");
    if (buf.length > 5 * 1024 * 1024) add("WARN", "X", "og:image 용량", "5MB 초과(X 크롤러 한도, 과거 문서)", "social-preview");
    if (size) {
      if (size.w <= 150 || size.h <= 150) add("WARN", "네이버", "og:image 크기", "150×150 초과 필요", "naver-search");
      if (Math.max(size.w / size.h, size.h / size.w) > 3) add("WARN", "네이버", "og:image 비율", "가로:세로 3:1 초과", "naver-search");
    }
  } catch (e) { add("FAIL", "공유", "og:image 응답", String(e.message).slice(0, 100), "social-preview"); }
}

async function checkRobots(origin, add) {
  try {
    const res = await fetch(`${origin}/robots.txt`, { headers: { "user-agent": UA } });
    const ct = res.headers.get("content-type") || "";
    const txt = await res.text();
    if (res.status >= 500) return add("FAIL", "공통", "robots.txt", `HTTP ${res.status} — 네이버는 5xx를 '모두 금지'로 해석`, "naver-search");
    if (res.status >= 400) return add("INFO", "공통", "robots.txt", `HTTP ${res.status} — 없음(모두 허용으로 해석)`, "naver-search");
    if (/text\/html/i.test(ct)) add("WARN", "공통", "robots.txt", "HTML로 응답 — 네이버는 '없음'으로 볼 수 있음. text/plain 권장", "naver-search");
    for (const agent of ["Googlebot", "Yeti", "Twitterbot", "facebookexternalhit"]) {
      if (robotsBlocksRoot(txt, agent)) add("FAIL", "공통", `robots.txt ${agent}`, "사이트 전체 차단", agent === "Yeti" ? "naver-search" : agent === "Googlebot" ? "google-search" : "social-preview");
    }
    const sitemaps = txt.split(/\r?\n/).filter((l) => /^\s*sitemap\s*:/i.test(l)).map((l) => l.split(/:(.+)/)[1].trim());
    add(sitemaps.length ? "INFO" : "WARN", "공통", "robots.txt Sitemap", sitemaps.length ? sitemaps.join(", ") : "Sitemap: 줄 없음", "google-search");
  } catch (e) { add("WARN", "공통", "robots.txt", `가져오기 실패: ${String(e.message).slice(0, 80)}`, "google-search"); }
}

export async function run(target) {
  const results = [];
  const add = (level, channel, item, detail, skill) => results.push({ level, channel, item, detail, skill });
  let html, baseUrl = null;
  if (/^https?:\/\//i.test(target)) {
    const { res, chain, finalUrl } = await fetchFollow(target);
    baseUrl = finalUrl;
    if (chain.length > 1) add("INFO", "공통", "리다이렉트", chain.map((c) => `${c.status} ${c.url}`).join(" → ") + ` → ${res.status}`, "google-search");
    if (chain.some((c) => c.status === 302 || c.status === 307)) add("INFO", "공통", "리다이렉트", "임시 리다이렉트(302/307) 포함 — 영구 이전이면 301", "naver-search");
    if (res.status !== 200) add(res.status >= 400 ? "FAIL" : "WARN", "공통", "HTTP 상태", `${res.status}`, "naver-search");
    html = await res.text();
    if (/http-equiv\s*=\s*["']?refresh/i.test(html)) add("WARN", "네이버", "meta refresh", "있음 — 네이버 소유 확인·수집에서 해석하지 않음. HTTP 리다이렉트 사용", "naver-search");
    const p = parseHtml(html);
    const { ogImage } = checkPage(p, add, baseUrl);
    checkJsonLd(p.jsonLd, add);
    if (ogImage && /^https?:/i.test(ogImage)) await checkImage(ogImage, add);
    await checkRobots(new URL(baseUrl).origin, add);
  } else {
    html = await readFile(target, "utf8");
    const p = parseHtml(html);
    checkPage(p, add, null);
    checkJsonLd(p.jsonLd, add);
    add("INFO", "공통", "범위", "로컬 파일: robots.txt·리다이렉트·이미지 응답은 확인하지 않음", "seo-orchestrator");
  }
  return { target, checkedAt: new Date().toISOString(), results };
}

function toMarkdown({ target, checkedAt, results }) {
  const icon = { FAIL: "❌", WARN: "⚠️", INFO: "ℹ️" };
  const order = { FAIL: 0, WARN: 1, INFO: 2 };
  const grouped = new Map();
  for (const r of results) {
    const key = [r.level, r.channel, r.item, r.detail].join("\u0000");
    const g = grouped.get(key);
    if (g) g.n++; else grouped.set(key, { ...r, n: 1 });
  }
  const rows = [...grouped.values()].sort((a, b) => order[a.level] - order[b.level]);
  const count = (l) => results.filter((r) => r.level === l).length;
  return [
    `## seo-check: ${target}`,
    `확인 시각 ${checkedAt} · ❌ ${count("FAIL")} · ⚠️ ${count("WARN")} · ℹ️ ${count("INFO")}`,
    "",
    "| 상태 | 채널 | 항목 | 내용 | Skill |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((r) => `| ${icon[r.level]} | ${r.channel} | ${r.item}${r.n > 1 ? ` ×${r.n}` : ""} | ${String(r.detail).replace(/\|/g, "\\|")} | ${r.skill} |`),
    "",
    "단일 페이지의 서버 HTML만 확인했습니다. 색인·순위·렌더링 결과는 Search Console·서치어드바이저 URL 검사로 확인하세요.",
  ].join("\n");
}

const isMain = Boolean(process.argv[1]) && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const target = args.find((a) => !a.startsWith("--"));
  if (!target) {
    console.error("사용법: node scripts/seo-check.mjs <URL | HTML 파일> [--json]");
    process.exit(2);
  }
  run(target)
    .then((r) => {
      console.log(json ? JSON.stringify(r, null, 2) : toMarkdown(r));
      process.exit(r.results.some((x) => x.level === "FAIL") ? 1 : 0);
    })
    .catch((e) => { console.error(`오류: ${e.message}`); process.exit(2); });
}
