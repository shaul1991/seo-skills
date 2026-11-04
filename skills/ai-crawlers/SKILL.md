---
name: ai-crawlers
description: >-
  ChatGPT·Claude·Grok·Gemini·Copilot·Perplexity·Meta AI·Apple·Mistral 같은 AI 검색·답변에 사이트가 노출·인용되도록 설정:
  각 AI가 쓰는 색인(OAI-SearchBot, Brave Search, X, Google, Bing 등), robots.txt·WAF/CDN 허용, 학습용 크롤러(GPTBot, ClaudeBot,
  Google-Extended 등)와의 구분, 페이지 단위 제어. "AI 검색에 노출", "ChatGPT에 나오게", "Claude 검색", "Grok", "GEO", "AI 학습 차단" 요청에 사용.
---

# AI 검색 노출 설정

**이 저장소의 기본값은 "AI 검색·답변 노출 허용"입니다.** 학습 차단은 운영자가 따로 결정하며, 결정하더라도 아래의 노출용 설정을 깨지 않게 합니다.

근거(2026-11-04 확인): [OpenAI 크롤러](https://developers.openai.com/api/docs/bots), [ChatGPT 검색 도움말](https://help.openai.com/en/articles/9237897-searching-the-web-with-chatgpt), [Anthropic 크롤러](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Anthropic 하위 처리자](https://trust.anthropic.com/subprocessors), [xAI Web Search](https://docs.x.ai/developers/tools/web-search)·[X Search](https://docs.x.ai/developers/tools/x-search), [Google 일반 크롤러(Google-Extended)](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers?hl=ko), [Google AI 기능](https://developers.google.com/search/docs/appearance/ai-features?hl=ko), [Bing 학습·그라운딩](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/), [Perplexity 크롤러](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Meta 웹 크롤러](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers), [Applebot](https://support.apple.com/ko-kr/119829), [Mistral 크롤러](https://docs.mistral.ai/robots), [네이버 로봇 메타](https://searchadvisor.naver.com/guide/markup-structure), [Brave Search Crawler](https://search.brave.com/help/brave-search-crawler).

## AI 서비스별로 무엇이 필요한가

| AI | 답변 근거가 되는 곳 | 노출에 필요한 설정 | 확인 |
| --- | --- | --- | --- |
| **ChatGPT** | OpenAI 자체 검색 색인 + 일부 다른 검색 제공자(이름 미공개) | `OAI-SearchBot` 허용, **호스트·CDN이 OpenAI 공개 IP(`https://openai.com/searchbot.json`)를 막지 않음**(OpenAI 도움말이 포함 조건으로 명시). 사용자 요청 시 `ChatGPT-User` | verified |
| **Claude** | **Brave Search**(Anthropic 하위 처리자 목록: 모든 제품의 Web Search) + `Claude-SearchBot` 색인 | `Claude-SearchBot`·`Claude-User` 허용, **Brave Search에 색인되기**: Googlebot이 크롤링할 수 있어야 함(Brave 크롤러가 Googlebot 규칙을 따름), 새 URL은 [Brave Submit URL](https://search.brave.com/submit-url) | verified |
| **Grok** | xAI의 실시간 웹 검색 + **X 게시물 검색**(X Search) | xAI는 웹 크롤러 이름·UA를 공식 문서에 공개하지 않음 → `User-agent: *` 허용 유지, 알 수 없는 봇 일괄 차단 금지. **X에 사이트 링크가 들어간 게시물**을 두고 X 카드(`social-preview`)를 맞춤 | 크롤러는 unverified |
| **Gemini**(앱) | Google 검색 색인 | Googlebot 허용, **`Google-Extended` 허용**(막으면 Gemini 앱·Vertex AI의 Google 검색 그라운딩에 쓰이지 않음. Google 검색 포함·순위에는 영향 없음) | verified |
| **Google AI 개요·AI 모드** | Google 검색 | 일반 SEO만, 별도 요구사항 없음(`google-search`) | verified |
| **Copilot·Bing AI** | Bing 색인 | Bingbot 허용, Bing 그라운딩 설정 기본값(허용) 유지, Bing Webmaster Tools AI Performance로 인용 확인 | verified |
| **Perplexity** | 자체 색인 | `PerplexityBot` 허용, WAF 허용 규칙(Cloudflare Bot Fight Mode는 예외 규칙으로도 못 건너뜀) | verified |
| **Meta AI** | Meta 색인 | `meta-webindexer` 허용 | verified |
| **Apple**(Siri·Spotlight·Safari) | Applebot 색인 | `Applebot` 허용, 답변에 쓰이려면 `nosnippet` 쓰지 않음 | verified |
| **Mistral**(Le Chat·Vibe) | Mistral 검색 색인 | `MistralAI-Index`, `MistralAI-User` 허용 | verified |
| **네이버 AI 출처설명** | 네이버 색인 | `nosourceinfo`를 쓰지 않음(`naver-search`) | verified |

## 노출 우선 robots.txt (기본)

```text
User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```

- 가장 안전한 형태는 **AI 크롤러를 따로 적지 않고 `*` 허용**입니다. 특정 봇 그룹을 만들면 그 봇은 `*` 규칙을 무시하고 자기 그룹만 따르므로, 그룹마다 `Disallow: /admin/` 같은 공통 규칙을 반복해야 합니다.
- 의도를 남기고 싶으면 아래처럼 검색·사용자 요청 봇을 명시합니다(공통 차단 경로를 같이 적음).

```text
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: meta-webindexer
User-agent: MistralAI-Index
User-agent: MistralAI-User
User-agent: Applebot
Allow: /
Disallow: /admin/
```

## 학습만 막고 싶을 때 (선택)

```text
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: meta-externalagent
Disallow: /

User-agent: MistralAI-Training
Disallow: /

# Microsoft AI 학습(2027-02-01부터 반영)
User-agent: __usage_ai-training
Disallow: /
```

- ⚠️ **`Google-Extended`는 이 목록에 넣지 않았습니다.** 학습뿐 아니라 Gemini 앱의 Google 검색 그라운딩도 함께 끄므로 "AI 검색 노출" 목표와 충돌합니다. 넣을지는 Gemini 노출을 포기할지와 함께 정합니다.
- Bing의 `ai-grounding:disallow`도 같은 이유로 노출 목표와 충돌합니다(Copilot 등 답변 근거에서 빠짐).
- 학습 차단은 각 사가 검색 노출에 영향이 없다고 밝힌 토큰(GPTBot, ClaudeBot, Applebot-Extended, meta-externalagent, MistralAI-Training, `__usage_ai-training`)만 씁니다.

## robots.txt 말고 막히는 곳: WAF·CDN·봇 차단

AI 노출 실패의 흔한 원인은 robots.txt가 아니라 **방화벽·CDN의 봇 차단**입니다.

1. CDN의 봇 차단·AI 크롤러 차단 기능이 켜져 있는지 확인합니다(Cloudflare 등 제품마다 이름이 다름 — 제품 문서 확인).
2. 각 사가 공개한 IP 목록으로 허용 규칙을 만듭니다: OpenAI(`searchbot.json`, `chatgpt-user.json`), Perplexity(`perplexitybot.json`, `perplexity-user.json`), Mistral(문서의 IP 목록), Applebot(CIDR JSON), Bingbot(확인 절차).
3. 서버 로그에서 UA별 응답 코드를 봅니다. 403·429·챌린지 페이지가 AI 봇에게 가고 있으면 노출되지 않습니다.
4. Perplexity 문서: Cloudflare Bot Fight Mode는 WAF 예외 규칙으로 건너뛸 수 없어 켜져 있으면 계속 막을 수 있습니다.

## 페이지 단위 제어 (노출을 줄이는 것들)

| 설정 | 효과 | 노출 목표라면 |
| --- | --- | --- |
| `noindex` | 대부분의 검색·AI 색인에서 제외 | 쓰지 않음 |
| `nosnippet`, `max-snippet:0`, `data-nosnippet` | Google·Apple 등에서 설명·AI 답변 사용 제한 | 꼭 필요한 부분에만 |
| `<meta name="Bingbot" content="ai-grounding:disallow">` | Copilot 등 Bing AI 답변 근거에서 제외(2027-02-01~) | 쓰지 않음 |
| `<meta name="robots" content="nosourceinfo">` | 네이버 AI 출처설명 제외 | 쓰지 않음 |

## 콘텐츠 쪽 (공통)

AI 답변도 결국 색인된 페이지에서 근거를 찾습니다. Google은 AI 기능에 별도 최적화가 필요 없다고 밝힙니다. 공통으로 효과가 있는 것:

- 서버 HTML에 핵심 사실(날짜·장소·조건·출처)을 텍스트로, 페이지마다 고유한 제목·설명
- 보이는 본문과 일치하는 구조화 데이터(`structured-data`)
- 마지막 확인 시각·공식 출처 링크(답변이 인용하기 쉬운 근거) — 비서 판단
- 사이트맵과 IndexNow로 새 URL을 빨리 알림(`indexnow`, Bing·네이버)

## 확인 방법

- `seo-orchestrator/scripts/seo-check.mjs <URL>`: robots.txt에서 AI 검색·사용자 요청·학습 크롤러 차단 여부를 나눠 보여 줍니다.
- 실제 노출: ChatGPT·Claude·Grok·Gemini·Copilot·Perplexity에서 사이트 고유 정보(예: 특정 행사명 + 일정)를 물어 출처에 사이트가 나오는지 기록합니다. 결과는 날짜·질문·서비스별로 남기고, 한 번의 결과로 노출 여부를 단정하지 않습니다.
- Bing Webmaster Tools AI Performance(Copilot·Bing AI 인용 수).

## 하지 말 것

- `llms.txt` 같은 파일을 "AI 노출 필수"로 안내하기 — Google은 별도 파일·마크업이 필요 없다고 밝혔고, 이번에 확인한 각 사 문서는 robots.txt와 IP 허용을 안내합니다. 넣어도 되지만 효과를 보장하지 않습니다.
- 학습 차단 의도로 검색용 봇(OAI-SearchBot, Claude-SearchBot, PerplexityBot, meta-webindexer, MistralAI-Index)까지 막기.
- Grok용이라며 공식 문서에 없는 UA를 확정 사실로 적기 — 커뮤니티 목록(예: [ai-robots-txt/ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt))에 `GrokBot`, `xAI-Grok` 등이 있지만 운영 방식은 "Unclear"로 표시돼 있습니다.
- IP 차단만으로 거부·허용을 관리하기 — 목록이 바뀝니다. 공개 JSON을 주기적으로 반영합니다.
