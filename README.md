# seo-skills

Google·네이버·X(Twitter)·카카오톡·Open Graph·IndexNow 기준을 한곳에 모아 **조합해서 쓰는** 코딩 에이전트용 SEO Skill 묶음입니다. 한국 서비스처럼 Google과 네이버를 함께 맞추고, 카카오톡·X 공유 미리보기까지 챙겨야 할 때를 위해 만들었습니다.

- Claude Code, Codex 등 [Agent Skills](https://agentskills.io) 형식을 읽는 에이전트에서 씁니다.
- 각 규칙은 공식 문서를 2026-11-04에 직접 읽고 요약한 것이며, 절마다 원문 링크가 있습니다. 출처 목록은 [REFERENCES.md](REFERENCES.md).
- Google, NAVER, X, Kakao, Meta와 관련 없는 비공식 저장소입니다.

## 구성

| Skill | 다루는 것 |
| --- | --- |
| [`seo-orchestrator`](skills/seo-orchestrator/SKILL.md) | **시작점.** 대상 채널을 정하고 아래 Skill을 순서대로 조합, 보고 형식, 점검 스크립트 |
| [`google-search`](skills/google-search/SKILL.md) | 크롤링·JS·canonical·사이트맵·제목·스니펫·사이트 이름·AI 개요·스팸 정책·Search Console |
| [`naver-search`](skills/naver-search/SKILL.md) | 서치어드바이저: Yeti·robots.txt 응답 코드 해석·소유 확인·로봇 메타(`nosourceinfo`)·og:image 조건·RSS/사이트맵 제출·파비콘·스팸 |
| [`structured-data`](skills/structured-data/SKILL.md) | JSON-LD 템플릿(Event·WebSite·Organization+sameAs·BreadcrumbList·ItemList)과 Google·네이버 지원 차이 |
| [`social-preview`](skills/social-preview/SKILL.md) | Open Graph·X 카드·카카오톡·Facebook/Threads 미리보기, 캐시 |
| [`indexnow`](skills/indexnow/SKILL.md) | 네이버·Bing 등에 변경 URL 알리기(키 파일, GET/POST, 응답 코드) |
| [`scaled-pages`](skills/scaled-pages/SKILL.md) | 지역·월·카테고리 조합 페이지를 대량으로 만들 때 색인·noindex·canonical 기준 |

점검 스크립트 [`skills/seo-orchestrator/scripts/seo-check.mjs`](skills/seo-orchestrator/scripts/seo-check.mjs)는 의존성 없는 Node 18+ 스크립트로, 한 페이지의 title·description·canonical·robots·og·twitter·파비콘·JSON-LD와 (URL이면) 리다이렉트·robots.txt·og:image 크기를 확인합니다.

### 조사하면서 확인한 것(2026-11-04)

- Google 이벤트 검색 환경(Event 리치 결과)의 제공 지역 목록에 **한국이 없습니다.** 네이버에는 Event 구조화 데이터 가이드가 없습니다.
- 네이버는 robots.txt의 **4xx를 모두 허용, 5xx를 모두 금지**로 해석하고, 소유 확인에서 JavaScript·meta refresh 리다이렉트를 지원하지 않습니다.
- 네이버 og:image가 검색 썸네일이 되려면 150×150 초과, 5,000바이트 이상, 가로:세로 3:1 이하.
- Google은 AI 개요·AI 모드에 **별도 파일·마크업이 필요 없다**고 밝힙니다. 네이버는 AI 출처설명을 끄는 `nosourceinfo` 로봇 메타를 제공합니다.
- X 카드 문서는 현재 docs.x.com에서 찾을 수 없어 2026년 초 보관본을 썼습니다(`historical`).

## 설치

[skills CLI](https://github.com/vercel-labs/skills)로 프로젝트에 설치:

```bash
# 전체
npx skills add shaul1991/seo-skills -a claude-code -a codex

# 일부만
npx skills add shaul1991/seo-skills -s seo-orchestrator naver-search social-preview -a claude-code -a codex

# 목록만 보기
npx skills add shaul1991/seo-skills --list
```

에이전트 세션 안에서 실행하면 `.agents/skills`에만 들어갈 수 있으니 `-a`로 대상 에이전트를 지정합니다.

Claude Code 플러그인:

```text
/plugin marketplace add shaul1991/seo-skills
/plugin install seo-skills@seo-skills
```

직접 복사: `skills/<이름>/` 폴더를 프로젝트의 `.claude/skills/`(Claude Code) 또는 `.agents/skills/`(Codex)에 복사합니다.

## 사용 예

```text
/seo-orchestrator 이 Next.js 프로젝트를 Google·네이버·카카오톡·X 기준으로 점검하고 고칠 목록을 만들어 줘
/naver-search robots.txt랑 서치어드바이저 소유 확인이 왜 실패하는지 봐 줘
/structured-data 행사 상세 페이지에 Event JSON-LD를 넣어 줘. 취소·연기 상태도 처리해 줘
/scaled-pages 지역×월 목록 페이지 중 어떤 걸 색인하고 어떤 걸 noindex할지 정해 줘
```

Codex에서는 `$seo-orchestrator ...`처럼 부릅니다.

점검 스크립트만 쓰기:

```bash
node skills/seo-orchestrator/scripts/seo-check.mjs https://example.com/events/123
node skills/seo-orchestrator/scripts/seo-check.mjs ./out/index.html --json
```

결과는 ❌(FAIL)·⚠️(WARN)·ℹ️(INFO) 표이며, FAIL이 있으면 종료 코드 1입니다. 서버 HTML 한 페이지만 보므로 색인·순위·JS 렌더링 결과는 Search Console·서치어드바이저 URL 검사로 따로 확인합니다.

## 최신성

검색엔진 정책과 수치는 바뀝니다. 각 Skill에 확인일과 원문 링크를 적었고, 판단이 결과를 좌우하면 원문을 다시 열도록 지시합니다. 바뀐 내용을 발견하면 이슈나 PR로 알려 주세요.

## 개발

```bash
npm test   # node --test, 의존성 없음
```

`tests/fixtures/bad.html`에 일부러 넣은 문제(제목 키워드 반복, 상대 경로 og:image, 본문 없는 SPA, fragment 링크, 잘못된 JSON-LD, 주소 없는 Event, body 안 소유 확인 메타 등)를 스크립트가 잡는지 확인합니다.

## 라이선스

MIT. 공식 문서의 저작권은 각 소유자에게 있으며, 이 저장소는 원문을 복제하지 않고 요약과 링크만 둡니다. 참고한 저장소는 [REFERENCES.md](REFERENCES.md#참고한-github-저장소)에 있습니다.
