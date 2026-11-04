---
name: other-search-engines
description: >-
  Google·네이버·Daum 외 검색엔진과 브라우저 내장 검색 대응: Bing(Edge·Copilot, Bingbot 확인, Bing Webmaster Tools, AI Performance,
  2027 AI 학습·그라운딩 설정), Brave Search(Brave 브라우저, 전용 UA 없음, Googlebot 규칙을 따름, URL 제출), DuckDuckGo(DuckDuckBot),
  Apple(Applebot, Safari·Spotlight·Siri). "Bing 색인", "Brave 검색에 안 나와요", "DuckDuckGo", "Applebot", "Safari 검색 제안" 요청에 사용.
---

# 기타 검색엔진과 브라우저 검색

근거는 각 절 끝(2026-11-04 확인). 브라우저마다 기본 검색엔진은 지역·버전·사용자 설정에 따라 다르므로, 대상 사용자가 쓰는 브라우저의 기본값은 따로 확인합니다.

## 공통으로 효과가 큰 것

- **Googlebot을 막지 않기:** Brave Search는 Googlebot이 크롤링할 수 없는 페이지는 크롤링하지 않고, Applebot은 Applebot 규칙이 없으면 Googlebot 규칙을 따릅니다. 즉 Googlebot 규칙이 여러 엔진에 그대로 번집니다.
- **`noindex`로 색인 제외:** Brave·Bing·Apple 모두 robots.txt가 아니라 `noindex`로 색인 제외를 처리합니다(크롤링은 허용해야 태그를 봄).
- **IndexNow:** Bing은 IndexNow로 변경 신호를 받습니다(재크롤링 보장은 아님) — `indexnow`.

## Bing (Microsoft Edge·Copilot)

- Bingbot 확인: 역방향 DNS 등 [How to Verify Bingbot](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26).
- Bing Webmaster Tools의 **AI Performance**(2026-02 공개 미리보기): Copilot·Bing AI 요약 등에서 사이트가 인용된 횟수, 인용 페이지, 그라운딩 검색어를 보여 줍니다. 출처: [Bing 블로그 2026-02-10](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)
- 지원 robots 메타(현재): `noindex`, `nosnippet`, `noarchive`(캐시 없음, Chat·Copilot에서 링크하지 않음, 학습 미사용), `nocache`(Chat·Copilot에서 URL·제목·스니펫만) 등. 출처: [Robots meta tags Bing supports](https://www.bing.com/webmasters/help/robots-meta-tags-and-attributes-that-bing-supports-5198d240)
- ⚠️ **2027년 변경**(2026-10-30 발표): `noarchive`·`nocache` 대신 AI 학습·그라운딩 설정을 따로 둡니다.
  - 학습: robots.txt `User-Agent: __usage_ai-training` + `Disallow: /`(경로 단위 가능) 또는 페이지 `<meta name="Bingbot" content="ai-training:disallow">` / `X-Robots-Tag: Bingbot: ai-training:disallow`
  - 그라운딩(페이지 단위만): `<meta name="Bingbot" content="ai-grounding:disallow">` 또는 `ai-grounding:disallowextended`(Microsoft 자체 제품에서만 허용, 제3자 그라운딩 서비스 제외)
  - 기본값은 둘 다 허용. 일반 Bing 검색 결과 자격에는 영향 없음. robots.txt 크롤링 차단을 덮어쓰지 않음.
  - 일정: 2026-12-15 Bing Webmaster Tools 임시 그라운딩 설정 열림(`noarchive`/`nocache` 사용 사이트만) → **2027-02-01 시행** → **2027-03-01까지** 새 설정을 게시하지 않으면 `noarchive`/`nocache`는 학습·그라운딩 설정으로 읽히지 않음 → 2027-09-30 임시 설정 만료.
  - 출처: [Your content, your choice (Bing 블로그 2026-10-30)](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/)
- Bing 웹마스터 가이드라인 본문은 이번에 로딩되지 않아 확인하지 못했습니다.

## Brave Search (Brave 브라우저)

- 자체 독립 색인. 크롤러는 **별도 User-Agent를 쓰지 않습니다**(Google만 허용하는 사이트에서 차별받지 않기 위해). 대신 **Googlebot이 크롤링할 수 없는 도메인·페이지는 크롤링하지 않습니다.**
- 색인 제외는 robots.txt가 아니라 `noindex`. 반영하려면 Brave가 다시 가져가야 하며, 다시 가져가게 하려면 [Submit URL](https://search.brave.com/submit-url)에 URL을 넣습니다(삭제된 페이지 제거도 여기 또는 not-found@brave.com).
- 크롤러는 Brave 브라우저의 Web Discovery Project(기본 꺼짐, 사용자 동의) 정보로도 일부 동작합니다.
- 결과가 부족한 검색어에는 사용자가 허용하면 Google 결과를 익명으로 섞습니다(Google fallback).
- 요약(AI Answers)과 Featured snippets는 색인된 페이지 내용으로 만들고 출처를 표시합니다.
- 출처: [Brave Search Crawler](https://search.brave.com/help/brave-search-crawler), [Google fallback](https://search.brave.com/help/google-fallback), [Featured snippets](https://search.brave.com/help/featured-snippets), [AI](https://search.brave.com/help/ai), [Web Discovery Project](https://support.brave.app/hc/en-us/articles/4409406835469-What-is-the-Web-Discovery-Project)

## DuckDuckGo

- 일반 링크·이미지 결과는 **대부분 Bing에서** 가져오고, Instant Answers는 위키백과 등 여러 출처와 자체 크롤러 **DuckDuckBot**으로 보완합니다. → Bing 대응이 곧 DuckDuckGo 대응의 대부분입니다.
- DuckDuckBot UA `DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)`, IP 목록 `https://duckduckgo.com/duckduckbot.json`, robots.txt 준수.
- 출처: [결과 출처](https://duckduckgo.com/duckduckgo-help-pages/results/sources), [DuckDuckBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot)

## Apple (Safari·Spotlight·Siri)

- Applebot이 수집한 데이터는 Spotlight, Siri, **Safari** 등의 검색 기능에 쓰입니다. 일반 지식 답변에 출처 링크가 붙을 수 있습니다.
- robots.txt: `User-agent: Applebot`. **Applebot 규칙이 없고 Googlebot 규칙이 있으면 Googlebot 규칙을 따릅니다.** `crawl-delay`는 따르지 않습니다.
- 렌더링을 하므로 JS·CSS·XHR를 막지 않습니다(또는 리소스 없이도 깔끔하게 렌더링되게).
- 메타: `<meta name="robots">` 또는 `<meta name="applebot">`에 `noindex`(Spotlight·Siri 제안 제외), `nosnippet`(설명·웹 답변 생성 안 함, 생성형 출력의 추가 컨텍스트로도 안 씀), `nofollow`, `none`, `all`. 비 HTML은 `X-Robots-Tag: applebot: nosnippet`.
- 생성형 AI 학습 제외: `User-agent: Applebot-Extended` / `Disallow: /`. 그래도 Applebot은 계속 크롤링해 Spotlight·Siri·Safari 검색에는 나올 수 있습니다.
- 유료 콘텐츠: JSON-LD `isAccessibleForFree: false`.
- 확인: 역방향 DNS `*.applebot.apple.com` 또는 Apple이 공개한 IP CIDR JSON.
- 출처: [Applebot에 관하여](https://support.apple.com/ko-kr/119829)

## 점검 순서

1. robots.txt에서 Googlebot·Bingbot·Applebot·DuckDuckBot·Daum·Yeti를 실수로 막지 않았는지(`seo-orchestrator` 스크립트가 확인).
2. 방화벽·CDN 봇 차단이 이 크롤러들을 막지 않는지(서버 로그의 UA·IP로 확인, 각 사의 IP 목록과 대조).
3. Bing Webmaster Tools 등록 → 사이트맵 제출 → IndexNow 연결 → AI Performance 확인.
4. Brave: 중요한 새 URL은 Submit URL로 재수집 요청.
5. `noarchive`/`nocache`를 쓰고 있다면 2027-03-01 전에 Bing의 새 학습·그라운딩 설정으로 옮길지 결정(`ai-crawlers`).
