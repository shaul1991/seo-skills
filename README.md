# Search Visibility

[English](README.en.md)

웹사이트의 검색·AI 가시성을 한곳에서 점검하세요. URL 기술 진단, Google 검색 실적, 직접 기록한 AI 답변의 브랜드 언급과 출처 인용을 로컬 HTML·JSON 보고서에서 확인할 수 있습니다.

## 1분 퀵스타트

Node.js 18 이상이 필요합니다. 아래 명령은 공개 GitHub 저장소에서 CLI를 가져옵니다. 예시 URL을 점검할 페이지로 바꿔 실행하세요.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility https://example.org/ --lang ko
```

출력 경로의 `index.html`을 열고 우선순위가 높은 FAIL·WARN부터 확인하세요. 같은 설정으로 반복 점검하려면 새 작업 폴더에서 스타터를 만들고 `targets`를 편집합니다.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility init --lang ko
```

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility ./visibility.config.json --out before --lang ko
```

수정 사항을 배포하고 동일한 조건으로 다시 측정한 뒤 비교합니다. `--out`에는 아직 없는 폴더를 지정하세요.

```sh
npx --yes --package=github:shaul1991/search-visibility search-visibility ./visibility.config.json --out after --lang ko
npx --yes --package=github:shaul1991/search-visibility search-visibility compare before/report.json after/report.json --out comparison --lang ko
```

한 페이지의 검색 기술 진단을 JSON으로 받으려면 다음을 실행하세요. `--expect-indexable`은 공개 전 색인 대상 페이지에 적용합니다. FAIL이 있으면 종료 코드는 1입니다.

```sh
npx --yes --package=github:shaul1991/search-visibility seo-check https://example.org/ --expect-indexable --json --lang ko
```

사이트 없이 결과를 살펴보려면 [합성 샘플 HTML 보고서](https://github.com/shaul1991/search-visibility/releases/download/v0.5.0/search-visibility-demo.html)를 다운로드해 여세요.

## 주요 기능

| 기능 | 확인할 수 있는 것 |
| --- | --- |
| 기술 진단 | HTTP 리다이렉트·robots.txt·색인 지시·canonical·사이트맵·hreflang·공유 태그·JSON-LD |
| AI 크롤러 규칙 | 최종 URL에 적용되는 검색·학습·사용자 요청 관련 robots.txt 규칙 |
| Google 검색 실적 | Search Console CSV의 클릭·노출·CTR 등 |
| AI 답변 관측 | 엔진별 브랜드 언급, 소유 도메인 및 공유 플랫폼의 내 계정 출처 인용 |
| 비교 보고서 | 기술 진단 건수, 검색 실적, AI 언급률·인용률의 전후 증감 |

## 검색·AI 가시성 실측 도구

보고서에서 영향을 받는 URL과 근거를 확인한 뒤, 아래 도구에서 공개 URL을 검증하세요. 수정 후 결과를 저장하고 다음 보고서와 비교합니다.

### 검색엔진 공식 콘솔·수집·제출

| 공식 도구 | 보고서에서 이어서 할 일 |
| --- | --- |
| [Google Search Console](https://search.google.com/search-console/about) | URL 검사에서 색인 상태와 Google이 선택한 canonical을 확인합니다. 실적에서 기간·필터를 정하고 CSV를 내보냅니다. |
| [Naver Search Advisor](https://searchadvisor.naver.com/) | 사이트 간단 체크에서 웹페이지 최적화를 확인하고, 소유 확인 후 웹마스터 도구에서 수집을 요청합니다. |
| [Daum 검색등록](https://register.search.daum.net/index.daum) | 사이트나 블로그를 등록하고 접수 상태를 조회합니다. |
| [Bing Webmaster Tools](https://www.bing.com/webmasters/about) | 소유 확인 후 URL 검사와 사이트맵 제출을 이용합니다. |
| [IndexNow](https://www.indexnow.org/) | 참여 검색엔진에 추가·수정·삭제된 URL을 알립니다. 접수 후 색인 상태는 해당 엔진에서 확인합니다. |

### 구조화 데이터·공유 미리보기·성능

| 공식 도구 | 보고서에서 이어서 할 일 |
| --- | --- |
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Google이 지원하는 리치 결과 유형과 필수 속성 오류를 확인합니다. |
| [Schema Markup Validator](https://validator.schema.org/) | Schema.org 타입과 속성을 확인합니다. |
| [Meta Sharing Debugger](https://developers.facebook.com/tools/debug/) | 공유 카드와 수집 정보를 확인하고 Scrape Again으로 다시 가져옵니다. |
| [Kakao Sharing Debugger](https://developers.kakao.com/tool/debugger/sharing) | 카카오 로그인 후 공유 미리보기를 확인하고 수정된 Open Graph 정보가 반영되도록 캐시를 초기화합니다. |
| [PageSpeed Insights](https://pagespeed.web.dev/) / [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) | 공개 URL의 실험실 측정과 수집된 현장 데이터가 있는지 PSI에서 확인합니다. 로컬 URL은 Chrome DevTools의 Lighthouse에서 측정합니다. |

### AI 답변 인용 실측

1. 퀵스타트의 `search-visibility init`으로 설정을 만들고 `targets`, `brand`, `domains`를 채웁니다. 공유 플랫폼의 내 계정도 집계하려면 `ownedUrlPrefixes`를 지정합니다.
2. ChatGPT Search, Perplexity, Google AI 개요·AI 모드, 네이버 AI 브리핑, Gemini에서 직접 질문하고 각 답변과 링크를 기록합니다. 엔진·질문·로캘·관측 시각·답변·출처를 `observations` 배열이나 설정 파일 기준 상대 경로의 JSON에 저장합니다. 검색 모드와 지역도 함께 기록해 다음 측정에 재사용하세요.
3. Search Console 실적을 함께 보려면 내보낸 CSV 경로를 `searchConsole`에 넣습니다. `search-visibility`로 기준 보고서를 만든 뒤 엔진별 관측 수, 브랜드 언급률, 소유 출처 인용률을 확인합니다.
4. 배포 후 같은 질문·엔진·모드·지역·언어로 답변을 다시 수집합니다. CSV도 같은 필터와 길이의 기간으로 맞춥니다. 새 보고서를 만들고 `search-visibility compare`를 실행합니다. 차이와 함께 표본 수를 확인하세요. 답변 변동은 배포 효과를 단독으로 입증하기 어렵습니다.

## 플랫폼별 가이드

| 주제 | 문서 |
| --- | --- |
| CLI 설정과 실제 데이터 입력 | [한국어](docs/workbench.ko.md) |
| Search Console CSV 가져오기 | [한국어](docs/search-console.ko.md) · [English](docs/search-console.en.md) |
| 다국어 URL·canonical·hreflang | [한국어](docs/localized-pages.ko.md) · [English](docs/localized-pages.en.md) |
| 네이버·Daum 검색과 네이버 AI 브리핑 | [한국어](docs/korea-search.ko.md) · [English](docs/korea-search.en.md) |
| ChatGPT Search 인용과 유입 | [한국어](docs/chatgpt-search.ko.md) · [English](docs/chatgpt-search.en.md) |
| Perplexity 모드별 관측 | [한국어](docs/perplexity-search.ko.md) · [English](docs/perplexity-search.en.md) |
| Google AI 개요와 AI 모드 | [한국어](docs/google-ai.ko.md) · [English](docs/google-ai.en.md) |
| Gemini 웹 앱 출처 관측 | [한국어](docs/gemini-app.ko.md) · [English](docs/gemini-app.en.md) |
| Bing·Copilot 인용과 콘솔 지표 | [한국어](docs/bing-ai.ko.md) · [English](docs/bing-ai.en.md) |
| AI 관측 조건과 전후 비교 | [한국어](docs/ai-comparison.ko.md) · [English](docs/ai-comparison.en.md) |
| 공개 프로젝트 비교 | [한국어](docs/landscape.ko.md) |

## 개별 Agent Skill 설치

[Agent Skills](https://agentskills.io) 형식을 지원합니다. 아래 명령은 `seo-orchestrator` 하나를 Claude Code와 Codex용으로 설치합니다. 다른 스킬을 선택하려면 `-s` 뒤의 이름을 바꾸거나 추가하세요.

```sh
npx skills add shaul1991/search-visibility -s seo-orchestrator -a claude-code -a codex -y
node .agents/skills/seo-orchestrator/scripts/visibility.mjs https://example.org/ --lang ko
```

수동으로 설치하려면 원하는 스킬 폴더 전체를 `.agents/skills/`(Codex) 또는 `.claude/skills/`(Claude Code) 아래에 복사합니다. 여러 채널을 함께 점검하려면 `seo-orchestrator`로 시작하세요.

| Skill | 다루는 것 |
| --- | --- |
| [`seo-orchestrator`](skills/seo-orchestrator/SKILL.md) | **시작점.** 대상 채널을 정하고 아래 Skill을 순서대로 조합, 보고 형식, 점검 스크립트 |
| [`google-search`](skills/google-search/SKILL.md) | 크롤링·JS·canonical·사이트맵·제목·스니펫·사이트 이름·AI 개요·스팸 정책·Search Console |
| [`naver-search`](skills/naver-search/SKILL.md) | 서치어드바이저: Yeti·robots.txt 응답 코드 해석·소유 확인·로봇 메타(`nosourceinfo`)·og:image 조건·RSS/사이트맵 제출·파비콘·스팸 |
| [`daum-search`](skills/daum-search/SKILL.md) | Daum(카카오): Daum/Daum-Preview 로봇, 검색등록, 웹마스터도구 PIN, 웹문서 미노출 점검, 연관 채널, 카카오톡 채널·카카오맵 |
| [`other-search-engines`](skills/other-search-engines/SKILL.md) | Bing(Edge·Copilot, 2027 AI 학습·그라운딩 설정), Brave Search(Brave 브라우저), DuckDuckGo, Apple(Safari·Spotlight·Siri) |
| [`ai-crawlers`](skills/ai-crawlers/SKILL.md) | **AI 검색 노출 설정**: ChatGPT·Claude·Grok·Gemini·Copilot·Perplexity·Meta AI·Apple·Mistral별 근거 색인과 필요한 robots.txt·WAF/CDN 설정, 학습 차단과의 구분 |
| [`ai-observations`](skills/ai-observations/SKILL.md) | 질문·엔진별 AI 답변에서 브랜드 언급과 소유 도메인·공유 플랫폼의 내 계정 인용을 따로 집계하고 출처를 확인 |
| [`structured-data`](skills/structured-data/SKILL.md) | JSON-LD 템플릿(Event·WebSite·Organization+sameAs·BreadcrumbList·ItemList)과 Google·네이버 지원 차이 |
| [`social-preview`](skills/social-preview/SKILL.md) | Open Graph·X 카드·카카오톡(스크랩 서버 IP·캐시 초기화)·Meta(Facebook·Instagram·Threads 크롤러 요구사항)·Daum 미리보기 |
| [`indexnow`](skills/indexnow/SKILL.md) | 네이버·Bing 등에 변경 URL 알리기(키 파일, GET/POST, 응답 코드) |
| [`scaled-pages`](skills/scaled-pages/SKILL.md) | 지역·월·카테고리 조합 페이지를 대량으로 만들 때 색인·noindex·canonical 기준 |
| [`browser-compat`](skills/browser-compat/SKILL.md) | Brave Shields·De-AMP, 파비콘·apple-touch-icon·theme-color·manifest, 분석 과소 집계 |

Claude Code 플러그인으로 전체 스킬을 설치할 수도 있습니다.

```text
/plugin marketplace add shaul1991/search-visibility
/plugin install seo-skills@seo-skills
```

## FAQ

**보고서에서 크롤링이 허용되면 실제로 색인되나요?**

진단은 점검 시점의 공개 응답과 크롤러 지시를 해석합니다. 실제 색인 상태와 대표 URL은 해당 엔진의 콘솔에서 확인하세요. 수집 요청·IndexNow 알림·마크업 적합 판정으로 노출이 보장되지는 않습니다.

**AI 답변이나 검색 실적은 자동으로 수집하나요?**

CLI가 집계하는 실적과 답변은 사용자가 제공한 데이터입니다. CLI 실행에는 외부 패키지나 API 키가 필요 없고, 소유권이 필요한 콘솔 기능은 해당 서비스에서 로그인합니다.

**몇 페이지를 검사하고 언어는 어떻게 바꾸나요?**

기본 최대 25페이지를 한 번에 4개씩 점검합니다. 사이트맵을 설정하면 해당 사이트맵을 쓰며, 생략하면 최종 URL의 같은 출처 `robots.txt`에 선언된 사이트맵을 찾습니다. 한국어가 기본이며 `--lang en|ko`가 설정 파일의 `locale`보다 우선합니다.

**로컬 페이지도 진단할 수 있나요?**

로컬 HTTP URL도 CLI에서 점검할 수 있습니다. 외부 실측 도구에는 해당 서비스가 접근할 수 있는 배포 URL을 사용하세요.

## 출처와 라이선스

[공식 정책과 출처 목록](REFERENCES.md) · [MIT 라이선스](LICENSE). Search Visibility는 독립 오픈소스 프로젝트입니다. 플랫폼 정책을 적용할 때는 최신 원문을 확인하세요.
