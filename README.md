# Search Visibility

[English quickstart](README.en.md)

Search Visibility는 웹사이트가 일반 검색 결과와 AI 답변에서 어떻게 발견되고 인용되는지 점검하기 위한 오픈소스 Agent Skills 프로젝트입니다. Google·네이버·Daum 검색부터 ChatGPT·Claude·Perplexity의 크롤러 접근, 카카오톡·Meta·X의 링크 미리보기까지 다룹니다.

- Claude Code, Codex 등 [Agent Skills](https://agentskills.io) 형식을 읽는 에이전트에서 씁니다.
- 각 규칙은 공식 문서를 2026-11-04에 직접 읽고 요약한 것이며, 절마다 원문 링크가 있습니다. 출처 목록은 [REFERENCES.md](REFERENCES.md).
- Google, NAVER, Kakao, Microsoft, Brave, Apple, Meta, X, OpenAI, Perplexity, Anthropic 등과 관련 없는 비공식 저장소입니다.

## 내 사이트의 검색 가시성 확인하기

사이트의 색인·크롤링 문제, Google 검색 노출·클릭, AI 답변의 브랜드 언급·출처 인용을 한 보고서에서 확인할 수 있습니다. **Node.js 18 이상**으로 실행합니다. CLI에는 외부 패키지, 서비스 계정, 유료 API 키가 필요하지 않습니다.

```bash
git clone https://github.com/shaul1991/search-visibility.git
cd search-visibility
npm run demo
```

출력된 `index.html`을 브라우저에서 열면 됩니다. 실행 전에 화면을 보려면 [샘플 HTML 보고서를 다운로드](https://github.com/shaul1991/search-visibility/releases/download/v0.5.0/search-visibility-demo.html)해 여세요. 예제에는 로컬 HTML 두 개, 합성 검색 성과 CSV, 합성 답변 세 건이 들어 있습니다. 실제 사이트를 점검할 때는 URL 목록이나 사이트맵을 지정하세요. 본인의 Search Console 내보내기와 직접 수집한 답변을 선택적으로 추가할 수 있습니다. [실제 데이터로 실행하기](docs/workbench.ko.md) · [참고한 공개 프로젝트 21개](docs/landscape.ko.md)

설정 없이 URL에서 점검을 시작하려면 저장소에서 아래 명령의 예시 URL을 색인 대상 페이지 주소로 바꿔 실행하세요. `--url https://example.org/` 형식도 지원합니다.

```bash
npm run visibility -- https://example.org/
```

설정을 재사용하려면 아래 첫 명령으로 스타터를 만든 뒤, 예시 URL을 편집하고 두 번째 명령을 실행하세요. `init` 뒤에 기존 폴더 안의 파일 경로를 지정할 수 있으며 기존 파일은 덮어쓰지 않습니다.

```bash
npm run visibility -- init
npm run visibility -- ./visibility.config.json
```

보고서의 심각도 배지에서 실패·경고 건수를 확인하고, 페이지 진단에서 심각도를 필터링하거나 우선순위순으로 정렬할 수 있습니다. 주요 문제에는 조치 방법이 표시됩니다. 요약은 클립보드로 복사할 수 있고, 인쇄 또는 PDF 저장 시 접힌 진단과 근거도 포함됩니다.

`sitemap`을 생략하면 최종 대상 URL의 `robots.txt`에서 같은 출처의 `Sitemap:` 선언을 찾아 점검 대상을 추가합니다. 설정에 사이트맵을 지정하면 해당 사이트맵을 우선합니다. 한 번에 최대 4페이지를 점검하고 보고서는 입력·발견 순서를 유지합니다. 다국어 페이지는 HTML `hreflang`의 `x-default` 선언과 점검에 성공한 URL 사이의 반환 링크를 확인합니다. 페이지별 보고서에는 최종 URL에 적용되는 AI 크롤러별 검색·학습·사용자 요청 등의 robots 규칙이 표시됩니다.

한국어가 기본입니다. 영문 CLI와 HTML 보고서는 `npm run demo -- --lang en`으로 확인할 수 있습니다. 설정 최상위에 `"locale": "en"`을 저장할 수 있으며, 실행 시 지정한 `--lang en|ko`가 설정값에 우선합니다. 페이지 제목, CSV 항목, 관측 질문 등 원본 데이터는 그대로 표시됩니다. 독립 실행 `seo-check`에서도 `--lang`을 사용할 수 있습니다.

`npm run visibility -- compare <변경전/report.json> <변경후/report.json>`으로 사이트 진단, Search Console 실적, AI 엔진별 가시성의 증감을 HTML과 JSON으로 생성합니다.

같은 질문의 AI 답변을 다시 수집했다면 [변경 전후 AI 출처 인용 비교](docs/ai-comparison.ko.md)에서 두 보고서를 만드는 방법을 확인하세요.

[네이버·Daum 웹 검색과 네이버 AI 브리핑 측정 안내](docs/korea-search.ko.md)에서 관측 절차와 합성 예제를 확인할 수 있습니다.

[ChatGPT 검색 가시성 측정 안내](docs/chatgpt-search.ko.md)에서 답변 인용과 사이트 유입을 측정하는 방법을 확인하세요.

[Perplexity 검색 인용 측정 안내](docs/perplexity-search.ko.md)에서 검색 모드를 기록하고 소유 계정의 인용을 집계하는 방법을 확인하세요.

[Gemini 웹 앱 출처 관측 안내](docs/gemini-app.ko.md)에서 공개 링크를 수집하고 언어·국가별로 집계하는 방법을 확인하세요.

[Google AI 개요·AI 모드 측정 안내](docs/google-ai.ko.md)에서 Search Console AI 노출수와 직접 수집한 답변의 인용률을 확인하세요.

[Bing과 Copilot AI 인용 측정 안내](docs/bing-ai.ko.md)에서 Bing Webmaster Tools 지표와 직접 수집한 답변을 비교하는 방법을 확인하세요.

### npm 패키지 실행

저장소에서 `npm pack`을 실행한 뒤 생성된 파일 경로로 아래 명령을 실행하세요. 두 번째 명령은 단일 페이지의 진단 결과를 JSON으로 출력합니다.

```bash
npx --yes --package=./search-visibility-0.6.0.tgz search-visibility https://example.org/ --lang en
npx --yes --package=./search-visibility-0.6.0.tgz seo-check https://example.org/ --json
```

npm 레지스트리에 게시된 뒤에는 `--package`에 `search-visibility`를 지정할 수 있습니다.

## 구성

필요한 스킬만 골라 설치할 수 있습니다. 여러 채널을 함께 점검할 때는 `seo-orchestrator`로 시작하고, 한 채널의 문제를 알고 있다면 해당 스킬을 바로 실행하세요. 예를 들어 네이버 소유 확인은 `naver-search`, AI 검색의 크롤러 접근과 답변 인용 확인 절차는 `ai-crawlers`가 다룹니다.

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

점검 스크립트는 의존성 없이 Node 18 이상에서 실행됩니다. HTML 한 페이지의 title·description·canonical·robots·공유 카드·파비콘·JSON-LD를 검사합니다. URL을 입력하면 리다이렉트와 최종 응답 헤더, robots.txt, Open Graph 이미지도 확인합니다. [점검 스크립트](skills/seo-orchestrator/scripts/seo-check.mjs)

### 조사하면서 확인한 것(2026-11-04)

- Google 이벤트 검색 환경(Event 리치 결과)의 제공 지역 목록에 **한국이 없습니다.** 네이버에는 Event 구조화 데이터 가이드가 없습니다.
- 네이버는 robots.txt의 **4xx를 모두 허용, 5xx를 모두 금지**로 해석하고, 소유 확인에서 JavaScript·meta refresh 리다이렉트를 지원하지 않습니다.
- 네이버 og:image가 검색 썸네일이 되려면 150×150 초과, 5,000바이트 이상, 가로:세로 3:1 이하.
- Google은 AI 개요·AI 모드에 **별도 파일·마크업이 필요 없다**고 밝힙니다. 네이버는 AI 출처설명을 끄는 `nosourceinfo` 로봇 메타를 제공합니다.
- X 카드 문서는 현재 docs.x.com에서 찾을 수 없어 2026년 초 보관본을 썼습니다(`historical`).
- **Brave Search 크롤러는 별도 User-Agent가 없고, Googlebot이 못 가는 곳은 가지 않습니다.** Applebot도 Applebot 규칙이 없으면 Googlebot 규칙을 따릅니다 → Googlebot 차단은 Brave·Safari 검색에도 번집니다.
- DuckDuckGo 일반 결과는 대부분 Bing에서 옵니다.
- **Bing은 2027-02-01부터 `noarchive`·`nocache` 대신 AI 학습(`__usage_ai-training`, `ai-training:disallow`)·그라운딩(`ai-grounding:disallow`) 설정을 따로 읽습니다.** 2027-03-01 이후 옛 태그는 이 용도로 읽지 않습니다(2026-10-30 발표).
- Daum은 웹문서 수집 `Daum/4.1`(robots 이름 `Daum`), 링크 미리보기 `Daum-Preview/1.0` 두 로봇을 씁니다.
- Meta 링크 미리보기 크롤러는 og 태그가 응답 **첫 1MB 안**에 있어야 하고 gzip·deflate를 요구합니다.
- **AI 검색 노출이 기본값입니다.** Claude 웹 검색은 Brave Search를 씁니다(Anthropic 하위 처리자 목록) → Brave 색인(=Googlebot 크롤링 가능)이 Claude 노출 조건. ChatGPT는 `OAI-SearchBot` 허용과 OpenAI IP를 막지 않는 CDN이 포함 조건. Grok은 웹 검색과 X 게시물 검색을 쓰며 xAI는 크롤러 UA를 공개하지 않습니다. `Google-Extended`를 막으면 Gemini 앱 그라운딩에서 빠집니다.

## 다른 Skill과 함께 쓰기

SEO는 이 저장소로 하고, 다루지 않는 일만 다른 Skill을 필요한 것만 골라 씁니다.

- 마케팅 문맥(대상·차별점·톤): [marketingskills `product-marketing`](https://github.com/coreyhaines31/marketingskills/tree/main/skills/product-marketing)
- 콘텐츠 기획(주제·우선순위·일정): [marketingskills `content-strategy`](https://github.com/coreyhaines31/marketingskills/tree/main/skills/content-strategy)
- 기술 SEO 점검 Skill(marketingskills `seo-audit` 등)은 함께 설치하지 않습니다(역할 중복).

```bash
npx skills add coreyhaines31/marketingskills -s product-marketing content-strategy -a claude-code -a codex
```

## 설치

[skills CLI](https://github.com/vercel-labs/skills)로 프로젝트에 설치:

```bash
# 전체
npx skills add shaul1991/search-visibility -s '*' -a claude-code -a codex

# 일부만
npx skills add shaul1991/search-visibility -s seo-orchestrator naver-search social-preview -a claude-code -a codex

# 목록만 보기
npx skills add shaul1991/search-visibility --list
```

에이전트 세션 안에서 실행하면 `.agents/skills`에만 들어갈 수 있으니 `-a`로 대상 에이전트를 지정합니다.

Claude Code 플러그인:

```text
/plugin marketplace add shaul1991/search-visibility
/plugin install seo-skills@seo-skills
```

`seo-skills@seo-skills`는 기존 설치와 호환되는 플러그인·마켓플레이스 식별자입니다.

직접 복사: `skills/<이름>/` 폴더를 프로젝트의 `.claude/skills/`(Claude Code) 또는 `.agents/skills/`(Codex)에 복사합니다.

### 개별 설치한 스킬에서 CLI 실행

프로젝트 루트에서 `seo-orchestrator`만 설치합니다.

```sh
npx skills add shaul1991/search-visibility -s seo-orchestrator -a claude-code -a codex -y
```

아래 합성 데이터를 프로젝트 루트의 `visibility.config.json`에 저장하고 Node.js 18 이상으로 설치된 스크립트를 실행합니다.

```json
{
  "brand": "Example Studio",
  "sample": true,
  "domains": ["bücher.example"],
  "observations": [
    {
      "engine": "Synthetic",
      "query": "어떤 서점이 있나요?",
      "locale": "ko-KR",
      "observedAt": "2026-01-15T12:00:00+09:00",
      "answer": "Example Studio를 살펴보세요.",
      "sources": ["https://xn--bcher-kva.example/books"]
    }
  ]
}
```

```sh
node .agents/skills/seo-orchestrator/scripts/visibility.mjs ./visibility.config.json
```

보고서는 관측 답변 1건 중 소유 출처를 인용한 답변 1건을 집계합니다. `domains`의 유니코드 도메인은 `sources`의 퓨니코드 호스트와 일치합니다. 한국어 질문과 UTC 오프셋은 입력 예시입니다. 이 명령은 제공한 답변을 로컬에서 집계하므로 검색엔진이나 AI 플랫폼에 접속하지 않습니다. Claude Code에 직접 복사했다면 `.claude/skills/seo-orchestrator/` 아래의 스크립트를 실행합니다.

## 사용 예

```text
/seo-orchestrator 이 Next.js 프로젝트를 Google·네이버·카카오톡·X 기준으로 점검하고 고칠 목록을 만들어 줘
/naver-search robots.txt랑 서치어드바이저 소유 확인이 왜 실패하는지 봐 줘
/structured-data 행사 상세 페이지에 Event JSON-LD를 넣어 줘. 취소·연기 상태도 처리해 줘
/ai-crawlers ChatGPT·Claude·Grok·Gemini 검색에 노출되게 robots.txt와 CDN 설정을 점검해 줘
/daum-search 다음 검색에 사이트가 안 나오는 이유를 점검해 줘
/browser-compat Brave에서 분석 수치가 비고 위젯이 안 보이는지 확인해 줘
/scaled-pages 지역×월 목록 페이지 중 어떤 걸 색인하고 어떤 걸 noindex할지 정해 줘
```

Codex에서는 `$seo-orchestrator ...`처럼 부릅니다.

점검 스크립트만 쓰기:

```bash
node skills/seo-orchestrator/scripts/seo-check.mjs https://example.com/events/123
node skills/seo-orchestrator/scripts/seo-check.mjs ./out/index.html --json
node skills/seo-orchestrator/scripts/seo-check.mjs https://example.com/events/123 --expect-indexable
```

**공개 전 점검**에는 색인하려는 페이지에 `--expect-indexable`을 붙입니다. 기본 점검에서 경고하는 `noindex`와 `none`을 이 모드에서는 FAIL로 보고합니다. FAIL이 있으면 종료 코드는 1입니다.

- URL 검사에서는 리다이렉트를 따라간 최종 URL의 **경로와 쿼리 문자열**에 robots.txt 규칙을 적용합니다. 색인 지시는 최종 응답의 `X-Robots-Tag`와 HTML의 robots 메타 태그를 함께 확인합니다. 같은 대상에 여러 지시가 있으면 그중 색인을 제한하는 지시도 보고합니다.
- URL과 로컬 HTML 모두 `<head>`의 canonical 선언을 확인해 대상 URL의 충돌과 `<body>`에 잘못 넣은 선언을 보고합니다. 로컬 파일에서는 HTML 안의 지시만 검사하므로 배포 후 URL로 다시 점검해야 CDN·서버가 추가한 헤더와 robots.txt까지 확인할 수 있습니다.

크롤링 허용 여부는 점검 시점의 규칙을 해석한 결과입니다. 실제 색인 상태는 Search Console·서치어드바이저에서 확인합니다. Google이 선택한 대표 URL은 Search Console의 URL 검사에서 확인할 수 있습니다.

언어·지역별 URL의 canonical과 색인 지시는 [다국어 페이지 점검 안내](docs/localized-pages.ko.md)를 따라 확인할 수 있습니다.

## 최신성

검색엔진 정책과 수치는 바뀝니다. 각 Skill에 확인일과 원문 링크를 적었고, 판단이 결과를 좌우하면 원문을 다시 열도록 지시합니다. 바뀐 내용을 발견하면 이슈나 PR로 알려 주세요.

## 개발

각 스킬은 `skills/<이름>/SKILL.md`에서 독립적으로 관리합니다. 새 스킬을 추가할 때는 어떤 요청에 쓰는지 명시하고 위 목록에 등록합니다. 다른 스킬과 함께 실행할 때 순서나 결과 인계가 필요하면 [seo-orchestrator](skills/seo-orchestrator/SKILL.md)에 연결합니다.

```bash
npm test   # node --test, 의존성 없음
```

PR과 `main` 푸시에서는 GitHub Actions가 Node 18·24로 같은 테스트를 실행합니다. 스킬을 추가하거나 CLI 사용법을 바꿀 때는 스킬 이름·설명, 조합 스킬 목록, 문서의 CLI 경로·옵션, Claude Plugin과 npm 배포 버전의 일치도 검사합니다. `tests/fixtures/bad.html`에는 제목 키워드 반복, 상대 경로 og:image, 잘못된 JSON-LD 등 점검기가 찾아야 할 예시가 들어 있습니다.

## 라이선스

MIT. 공식 문서의 저작권은 각 소유자에게 있으며, 이 저장소는 원문을 복제하지 않고 요약과 링크만 둡니다. 참고한 저장소는 [REFERENCES.md](REFERENCES.md#참고한-github-저장소)에 있습니다.
