---
name: seo-orchestrator
description: >-
  여러 검색·공유 채널(Google, 네이버, X/Twitter, 카카오톡, Facebook/Threads, Bing 등)을 한 번에 맞추는 SEO 작업의 시작점.
  대상 채널을 정하고 이 저장소의 하위 Skill(google-search, naver-search, structured-data, social-preview, indexnow, scaled-pages)을
  순서대로 조합해 점검·구현·보고한다. "SEO 해줘", "검색 노출 점검", "구글이랑 네이버 둘 다", "SEO audit", "launch SEO checklist"
  같은 요청에 사용. Entry point that combines Google, Naver, social preview, structured data, IndexNow and scaled-page skills.
---

# SEO 조합 시작점

이 Skill은 직접 모든 규칙을 담지 않습니다. 대상 채널을 정한 뒤 아래 하위 Skill을 순서대로 불러 조합합니다.

| 하위 Skill | 다루는 것 |
| --- | --- |
| `google-search` | Google 크롤링·색인·제목·스니펫·사이트맵·canonical·사이트 이름·AI 기능·스팸 정책·Search Console |
| `naver-search` | 네이버 서치어드바이저: Yeti, robots.txt, 소유 확인, 메타·오픈그래프, RSS·사이트맵 제출, 수집 요청, 파비콘, 스팸 |
| `structured-data` | JSON-LD 템플릿(Event, Organization/sameAs, WebSite, BreadcrumbList)과 Google·네이버 차이 |
| `social-preview` | Open Graph, X(Twitter) 카드, 카카오톡 공유 미리보기, Facebook·Threads |
| `indexnow` | IndexNow로 네이버·Bing 등에 변경 URL 알리기 |
| `scaled-pages` | 지역·날짜·카테고리 조합 페이지를 대량으로 만들 때의 품질 기준(얇은 페이지·도어웨이 회피) |

## 1. 먼저 정할 것

질문은 최대 3개. 코드에서 알 수 있는 것은 묻지 않습니다.

1. **대상 채널:** 검색(Google·네이버·Bing), 공유(카카오톡·X·Facebook·Threads) 중 무엇이 중요한가. 기본값: 한국 서비스면 Google + 네이버 + 카카오톡 + X.
2. **사이트 상태:** 아직 코드만 있음 / 배포됨(URL 있음) / Search Console·서치어드바이저 등록됨.
3. **페이지 유형:** 홈, 목록, 상세(행사·상품·글), 지역·월별 모음 등. 대량 생성 페이지가 있으면 `scaled-pages`를 반드시 포함.

## 2. 조합 순서

1. **크롤링·색인 기반(공통):** robots.txt, HTTP 상태 코드, 리다이렉트, canonical, 서버 HTML에 본문이 있는지, `<a href>` 링크, 사이트맵.
   → `google-search` §크롤링, `naver-search` §수집 둘 다 적용. 충돌하면 더 엄격한 쪽을 따릅니다(예: 네이버는 JavaScript·meta refresh 리다이렉트를 소유 확인에서 지원하지 않음 → HTTP 301/302 사용).
2. **페이지 메타:** 고유 `<title>`, `meta description`, `og:*`, `twitter:*`, 파비콘, `html lang`.
   → `google-search` §제목·스니펫, `naver-search` §콘텐츠 마크업, `social-preview`.
3. **구조화 데이터:** 페이지 유형에 맞는 JSON-LD. 보이는 본문과 일치하는 값만.
   → `structured-data`.
4. **대량 페이지 품질:** 조합 페이지가 있다면 색인 대상 기준과 noindex 기준.
   → `scaled-pages`.
5. **알리기·측정:** Google Search Console(사이트맵 제출, URL 검사), 네이버 서치어드바이저(소유 확인, 사이트맵·RSS 제출), IndexNow, 공유 디버거.
   → `google-search` §Search Console, `naver-search` §웹마스터도구, `indexnow`, `social-preview` §캐시.

## 3. 자동 점검 스크립트

배포된 URL이나 빌드된 HTML 파일이 있으면 먼저 돌립니다. 이 Skill 폴더의 `scripts/seo-check.mjs`(의존성 없음, Node 18+)입니다. `<skill 폴더>`는 이 SKILL.md가 있는 폴더입니다.

```bash
node <skill 폴더>/scripts/seo-check.mjs https://example.com/page      # URL (robots.txt·사이트맵 위치도 확인)
node <skill 폴더>/scripts/seo-check.mjs ./out/events/123.html         # 로컬 HTML
node <skill 폴더>/scripts/seo-check.mjs --json https://example.com/   # 기계용 출력
```

스크립트는 단일 페이지의 마크업만 봅니다. 순위·색인 여부·렌더링 결과는 알 수 없습니다. Search Console·서치어드바이저의 URL 검사로 따로 확인합니다.

## 4. 보고 형식

```markdown
## SEO 점검 결과 (<URL 또는 경로>, <확인 시각>)
| 채널 | 항목 | 상태 | 근거 | 조치 |
| --- | --- | --- | --- | --- |
| 공통 | robots.txt | ✅/⚠️/❌ | 관찰값 | 할 일 |
...
### 확인하지 못한 것
- 예: 실제 색인 여부(Search Console 미연결), 카카오톡 미리보기 캐시(공유 디버거 로그인 필요)
```

- 관찰한 값과 추론을 구분합니다. "순위가 오를 것"처럼 결과를 보장하지 않습니다(Google·네이버 모두 색인·노출을 보장하지 않는다고 명시).
- 이 저장소의 규칙은 2026-11-04 확인 기준입니다. 정책·수치가 판단을 좌우하면 하위 Skill에 적힌 공식 원문을 다시 엽니다.

## 하지 말 것

- 페이지에 없는 가격·날짜·후기·평점을 구조화 데이터나 메타에 넣기
- 검색 노출만을 위한 키워드 반복, 숨긴 텍스트, 같은 내용의 페이지 대량 생성
- 검색엔진별로 다른 HTML 제공(클로킹)
- 근거 없이 `llms.txt` 같은 AI 전용 파일을 "필수"라고 안내하기(Google은 AI 기능에 별도 파일·마크업이 필요 없다고 밝힘 — `google-search` 참고)
