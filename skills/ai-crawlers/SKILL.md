---
name: ai-crawlers
description: >-
  AI 검색·답변 엔진과 학습용 크롤러의 robots.txt·메타 정책 설계: ChatGPT(OAI-SearchBot, GPTBot, ChatGPT-User), Perplexity,
  Claude(Claude-SearchBot, ClaudeBot, Claude-User), Google-Extended, Applebot-Extended, Meta(Meta-WebIndexer, Meta-ExternalAgent 등),
  Bing AI 학습·그라운딩, 네이버 nosourceinfo. "AI 검색에 노출", "ChatGPT 검색에 나오게", "AI 학습 차단", "GPTBot 막기", "GEO" 요청에 사용.
---

# AI 검색·학습 크롤러 정책

근거(2026-11-04 확인): [OpenAI 크롤러](https://developers.openai.com/api/docs/bots), [Perplexity 크롤러](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), [Anthropic 크롤러](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), [Meta 웹 크롤러](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers)(2026-05-21 갱신), [Applebot](https://support.apple.com/ko-kr/119829), [Google AI 기능](https://developers.google.com/search/docs/appearance/ai-features?hl=ko), [Bing 학습·그라운딩](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/), [네이버 로봇 메타](https://searchadvisor.naver.com/guide/markup-structure).

## 먼저 정할 것: 세 가지는 따로 결정합니다

1. **AI 검색·답변에 노출·인용**(검색용 크롤러) — 막으면 그 서비스의 검색 답변에서 빠집니다.
2. **모델 학습에 사용**(학습용 크롤러·토큰) — 막아도 대부분 검색 노출에는 영향이 없다고 각 사가 밝힙니다.
3. **사용자가 요청한 실시간 가져오기**(user fetcher) — 일부는 robots.txt를 따르지 않습니다.

## 크롤러 표

| 회사 | 검색·인용 | 학습 | 사용자 요청 가져오기 |
| --- | --- | --- | --- |
| Google | `Googlebot`(일반 검색과 AI 개요·AI 모드 공통, 별도 요구사항 없음) | `Google-Extended`(Google의 다른 AI 학습·그라운딩 제한) | — |
| OpenAI | `OAI-SearchBot`(막으면 ChatGPT 검색 답변에 안 나옴, 탐색 링크로는 나올 수 있음) | `GPTBot` | `ChatGPT-User` |
| Perplexity | `PerplexityBot`(학습에 쓰지 않는다고 명시) | — | `Perplexity-User`(일반적으로 robots.txt 무시) |
| Anthropic | `Claude-SearchBot` | `ClaudeBot` | `Claude-User` |
| Meta | `meta-webindexer`(Meta AI 검색 인용) | `meta-externalagent` | `meta-externalfetcher`(robots.txt 우회 가능) |
| Apple | `Applebot`(Spotlight·Siri·Safari) | `Applebot-Extended` | — |
| Microsoft | `Bingbot` | robots.txt `__usage_ai-training` 또는 메타 `ai-training:disallow`(2027-02-01 시행) | — |

- Meta `facebookexternalhit`은 링크 미리보기용이며 보안·무결성 검사 때 robots.txt를 우회할 수 있습니다(`social-preview`). `meta-externalads`는 광고 목적.
- Anthropic은 비표준 `Crawl-delay`를 지원하고, IP 차단보다 robots.txt로 거부할 것을 권합니다. 서브도메인마다 robots.txt가 필요합니다.
- Meta 크롤러는 robots.txt를 최대 24시간 캐시합니다.
- OpenAI·Perplexity는 공개 IP 목록 JSON을 제공합니다(WAF 허용 규칙에 사용). Perplexity는 Cloudflare·AWS WAF 허용 예시를 문서에 둡니다.

## 기본 추천안: "AI 검색 노출은 허용, 학습은 차단" (비서 판단)

정보 제공형 공개 사이트(행사 일정 등)는 인용될수록 유입 기회가 생기므로 검색·인용 크롤러는 허용하고, 학습 여부는 운영자가 정합니다.

```text
# 검색·인용 허용 (명시적으로 둘 필요는 없지만 의도를 남김)
User-agent: OAI-SearchBot
User-agent: PerplexityBot
User-agent: Claude-SearchBot
User-agent: meta-webindexer
Allow: /

# 학습 차단 (원할 때만)
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: meta-externalagent
Disallow: /

# Microsoft AI 학습 선호(2027-02-01부터 반영). Bing 예시처럼 별도 그룹으로
User-agent: __usage_ai-training
Disallow: /

User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://example.com/sitemap.xml
```

- 같은 그룹에 여러 `User-agent` 줄을 두는 것은 표준 문법이지만, 크롤러별 해석을 확신할 수 없으면 그룹을 하나씩 나눠 씁니다.
- `__usage_ai-training`은 Bing이 발표한 IETF AI Preferences 기반 공유 토큰입니다(Microsoft 2027-02-01부터 반영). 다른 회사의 지원 여부는 확인하지 않았습니다.

## 페이지 단위 제어

| 목적 | 방법 |
| --- | --- |
| Google 스니펫·AI 답변에서 본문 사용 제한 | `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex` |
| Apple 설명·웹 답변·생성형 컨텍스트 제외 | `<meta name="applebot" content="nosnippet">` |
| Bing 그라운딩 제외(2027-02-01~) | `<meta name="Bingbot" content="ai-grounding:disallow">` (또는 `disallowextended`) |
| 네이버 AI 출처설명 제외 | `<meta name="robots" content="nosourceinfo">` |

## 하지 말 것

- `llms.txt` 같은 파일을 "AI 노출 필수"로 안내하기 — Google은 AI 기능에 별도 파일·마크업이 필요 없다고 밝혔고, 이번에 확인한 다른 회사 문서도 robots.txt를 제어 수단으로 안내합니다. 넣는 것은 자유지만 효과를 보장하지 않습니다.
- 학습 차단 의도로 `OAI-SearchBot`·`PerplexityBot`·`Claude-SearchBot`까지 막기 — 그 서비스의 검색 답변 노출이 줄어듭니다.
- IP 차단만으로 거부하기 — 회사마다 IP가 바뀌며, Anthropic은 robots.txt 사용을 권합니다.
