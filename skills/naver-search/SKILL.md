---
name: naver-search
description: >-
  네이버 검색 SEO(서치어드바이저·웹마스터도구): 검색로봇 Yeti, robots.txt, 사이트 소유 확인, 대표 URL·로봇 메타(noindex, nosourceinfo),
  title·description·오픈그래프, RSS·사이트맵 제출, 수집 요청·검색 제외, JavaScript·SPA, 모바일, 파비콘, 콘텐츠·스팸 정책, IndexNow.
  "네이버에 안 나와요", "네이버 SEO", "서치어드바이저", "Yeti 차단", "네이버 사이트맵 제출" 요청에 사용. Naver Search Advisor SEO for Korean sites.
---

# 네이버 검색(서치어드바이저)

근거: [네이버 서치어드바이저 웹마스터 가이드](https://searchadvisor.naver.com/guide) 원문(2026-11-04 확인). 이 Skill은 요약이며 원문 저작권은 NAVER Corp.에 있습니다. 판단이 중요한 부분은 링크한 원문을 다시 엽니다.

Google 규칙을 그대로 옮기지 않습니다. 네이버와 다른 점은 ⚠️로 표시했습니다.

## 등록과 소유 확인

- 네이버 웹 검색에는 별도 "등록" 절차가 없고 검색로봇이 자동 수집합니다. 웹마스터도구 등록·소유 확인은 수집·색인·노출 리포트와 요청 기능을 쓰기 위한 것입니다.
- 소유 확인: `<head>` 안의 `<meta name="naver-site-verification" content="...">` 또는 HTML 파일 업로드. 사이트 단위는 호스트(`www.mysite.com`, `blog.mysite.com`)이며 경로(`/myid`)는 안 됩니다.
- ⚠️ 소유 확인은 JavaScript를 실행하지 않습니다. JavaScript·meta refresh·cookie 리다이렉트를 거치거나, 메타 태그가 `<body>`나 frame 안에 있으면 실패합니다. 서버의 HTTP 301/302를 씁니다. 방화벽이 네이버 검색로봇을 막아도 실패합니다.
- 출처: [사이트 등록 및 소유확인 FAQ](https://searchadvisor.naver.com/guide/faq-start-register), [검색엔진 최적화의 목적](https://searchadvisor.naver.com/guide/seo-basic-intro)

## robots.txt (검색로봇 `Yeti`)

- 루트에 `text/plain`으로. 없으면 모두 허용으로 간주합니다. 규칙은 같은 호스트·프로토콜·포트에만 적용됩니다(`www`와 루트 도메인, http와 https는 각각).
- ⚠️ 응답 코드별 해석: 2xx 규칙 사용(HTML로 반환되면 '없음'으로 볼 수 있음), 3xx 5회까지 따라감(HTML·JS 리다이렉트는 해석 안 함), **4xx 모두 허용**, **5xx 모두 금지**(이전 규칙이 있으면 일시 사용).
- JS·CSS 경로와 파비콘 경로를 막지 않습니다(렌더링·검색 결과 파비콘에 필요).
- `Sitemap:` 줄로 사이트맵 위치를 알릴 수 있습니다. 웹마스터도구의 robots.txt 도구로 검증·수집 요청이 가능합니다.

```text
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://www.example.com/sitemap.xml
```

- 출처: [robots.txt 설정하기](https://searchadvisor.naver.com/guide/seo-basic-robots)

## 대표 URL·로봇 메타·HTTP

- 같은 내용은 하나의 호스트·URL로. 여러 주소가 필요하면 대표 주소로 **HTTP 301**, 어렵다면 `rel="canonical"`. www 유무도 한쪽으로 리다이렉트. 메인 페이지는 canonical보다 HTTP 리다이렉트를 권장합니다.
- 호스트 이름에 밑줄(`_`) 금지(알파벳·숫자·하이픈만, 하이픈은 앞뒤 불가).
- 로봇 메타: `index,follow`(기본), `index,nofollow`, `noindex,follow`, `noindex,nofollow`.
- ⚠️ `<meta name="robots" content="nosourceinfo">`: 해당 사이트에 대해 **AI로 자동 생성된 출처설명을 제공하지 않게** 합니다(네이버 전용 지시어).
- 리다이렉트만 하는 페이지의 메타 태그는 반영되지 않을 수 있으니 리다이렉트 대상 페이지에 같은 설정을 둡니다.
- 소프트 404 금지: 없는 자료 404, 로그인 필요 403, 이전 301, 점검·만료 503. 오류 화면을 200으로 주지 않습니다.
- 출처: [웹 사이트를 만들 때](https://searchadvisor.naver.com/guide/seo-basic-create), [선호 URL 및 로봇 메타 태그](https://searchadvisor.naver.com/guide/markup-structure), [색인 효율성](https://searchadvisor.naver.com/guide/seo-advanced-indexing), [웹 페이지의 이동](https://searchadvisor.naver.com/guide/seo-basic-redirect)

## URL·JavaScript(SPA)

- 읽기 쉬운 경로(`/guide/creator`), 파라미터 최소화, https, 고유 도메인(호스팅 기본 도메인보다).
- ⚠️ fragment(`#`)와 해시뱅(`#!`)은 해석하지 않고 잘라냅니다. 독립 콘텐츠는 별도 경로(permalink)로.
- 링크는 표준 `<a href>`와 앵커 텍스트. JavaScript 함수만으로 된 링크는 URL을 알 수 없습니다.
- Yeti는 브라우저처럼 렌더링하지만, JS가 아직 수집되지 않았으면 정적 HTML을 먼저 색인합니다. JS URL에 매번 바뀌는 timestamp·hash를 붙이면 해석이 어긋날 수 있습니다. 본문은 서버 HTML로 주는 것이 안전합니다.
- 출처: [검색 친화적인 URL](https://searchadvisor.naver.com/guide/seo-advanced-url), [자바스크립트 검색 최적화](https://searchadvisor.naver.com/guide/seo-advanced-javascript)

## 콘텐츠 마크업(title·description·오픈그래프)

- 메인 페이지 `<title>`: 브랜드명(상호·서비스명 등 고유명사). 노출 목적으로 자주 바꾸지 않습니다.
- 개별 페이지 `<title>`: 주제를 명확히, 페이지마다 고유하게. 글자 수 제한은 없지만 검색 결과에 표시 가능한 길이로. 키워드 2회 이상 반복·스팸 키워드는 불이익.
- `meta description`: 1~2문장. 본문 통째 복사, 제목과 동일, 모든 페이지 동일, 키워드 나열은 불이익.
- 오픈그래프(`og:type`, `og:title`, `og:description`, `og:image`, `og:url`)도 네이버가 분석·노출에 쓰는 경우가 있어 함께 넣기를 권장합니다. `twitter:*` 태그 예시도 가이드에 있습니다(`social-preview`).
- ⚠️ `og:image`가 네이버 검색 썸네일로 쓰이려면: **150×150 초과**, **5,000바이트 이상**, **가로:세로 3:1 이하**, 페이지 고유 이미지(사이트 공통 로고·배너는 쓰지 않을 수 있음).
- 참고(공식 문서 미확인): 일부 커뮤니티 Skill은 네이버 URL 검사에서 description 80자 초과 경고를 보고합니다. 공식 가이드에는 길이 제한이 없으므로 경고가 보이면 웹마스터도구 결과를 그대로 기록합니다.
- 출처: [콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content)

## 모바일·파비콘

- 반응형이면 `<meta name="viewport" content="width=device-width, initial-scale=1">`. 별도 모바일 URL이면 1:1 대응 URL을 명시하고 기기별 리다이렉트는 HTTP로.
- 파비콘: 정사각형 16px 이상(32px 이상 권장), ICO·PNG·GIF·JPEG·APNG·SVG. `<link rel="icon" href="https://절대경로">`(상대 경로 아님). URL을 자주 바꾸지 않고 robots.txt로 막지 않습니다.
  - ⚠️ Next.js의 파일 규칙(`app/icon.*`, `app/apple-icon.*`, `favicon.ico`)은 `metadataBase`를 설정해도 `<link href>`를 **상대 경로**로 냅니다(Next 16 `resolve-icons` 확인). 절대 경로가 필요하면 아이콘을 일반 경로(예: `app/brand/icon-64.png/route.tsx`)로 제공하고 `metadata.icons`에 운영 도메인 절대 URL을 넣습니다.
- 출처: [모바일 사용성](https://searchadvisor.naver.com/guide/markup-mobile), [파비콘](https://searchadvisor.naver.com/guide/markup-favicon)

## RSS·사이트맵 제출(콘텐츠 피드)

- 웹마스터도구에 제출한 RSS·사이트맵을 "콘텐츠 피드"로 보고 주기적으로 재방문합니다.
- 공통 검증: 모든 URL이 소유 확인된 사이트와 같은 도메인, 파일 10MB 미만, 응답이 느리면 제한.
- 사이트맵: 파일당 URL 50,000개 미만, 모든 URL 포함 권장, 사이트맵 색인 파일 지원. `lastmod`·`changefreq`·`priority`는 선택.
- RSS: item 1개 이상, 본문 전체 공개 권장. URL을 많이 담기 어려우니 사이트맵을 우선 활용.
- 출처: [RSS 및 사이트맵 제출](https://searchadvisor.naver.com/guide/request-feed)

## 수집 요청·검색 제외·IndexNow

- 웹마스터도구 수집 요청은 제한된 범위의 도우미입니다. 처리에 1일~몇 주, 같은 URL을 매일 반복 요청할 필요 없음, 수집 성공이 노출을 보장하지 않음.
- 검색 제외: 원본 삭제 → 404 확인 → 웹 페이지 검색 제외 요청(재색인 후 반영).
- 변경 URL 알림은 IndexNow(`https://searchadvisor.naver.com/indexnow`) — `indexnow` Skill.
- 출처: [수집요청 및 검색제외](https://searchadvisor.naver.com/guide/request-crawl), [IndexNow 소개](https://searchadvisor.naver.com/guide/indexnow-about)

## 구조화 데이터

- schema.org를 쓰며 Microdata 또는 JSON-LD 권장. 마크업해도 반영은 보장되지 않습니다.
- 가이드 메뉴에 있는 유형(2026-11-04 확인): 사이트 연관채널(Organization/Person + `sameAs`), 주소(Address), 사이트 이동 경로(BreadcrumbList), 캐러셀(ListItem), 평점(AggregateRating), 레시피, 리뷰, 식당, TV 시리즈, 영화, 소프트웨어, 동영상 검색. ⚠️ **Event 유형 가이드는 없습니다.** 행사 페이지는 Google용 Event 마크업을 두되 네이버에서의 효과를 가정하지 않습니다.
- 템플릿은 `structured-data` Skill.
- 출처: [구조화된 데이터 소개](https://searchadvisor.naver.com/guide/structured-data-intro), [사이트 연관채널](https://searchadvisor.naver.com/guide/structured-data-channel), [BreadcrumbList](https://searchadvisor.naver.com/guide/structured-data-breadcrumb)

## 콘텐츠·스팸 정책

- 권장: 고유한 브랜드명, 간결하고 정확한 제목·설명, 핵심 정보는 텍스트(이미지면 alt), 전문성·경험, 일관된 주제, 공식 자료 인용.
- 스팸: 클로킹, 부적절한 리다이렉트, 링크 스팸, 백링크 악용, 만료 도메인 악용, 매크로·조작, 해킹 콘텐츠, 숨겨진 텍스트, 키워드 반복·남용, 낚시성, **저품질 콘텐츠 대량 생성**(동일·유사 템플릿으로 문장 일부만 바꾼 페이지를 대량 발행 — 기술 사용 여부만으로 판단하지 않음), 스크래핑.
- 서브링크는 자동 생성(요청 불가). 표준 링크·앵커 텍스트·GNB·사이트맵이 도움, 반영 평균 7일 이내.
- 출처: [콘텐츠 작성시 권장 사항](https://searchadvisor.naver.com/guide/content-basic), [웹 콘텐츠 스팸사례](https://searchadvisor.naver.com/guide/content-abusing), [서브링크](https://searchadvisor.naver.com/guide/faq-sublink)

## 점검 순서

1. robots.txt 응답 코드·내용(Yeti 허용, JS·CSS·파비콘 허용).
2. 대표 URL: www/https 통일 301, 파라미터 URL canonical.
3. 서버 HTML에 본문·`<a href>` 링크, fragment 라우팅 없음.
4. `<head>`: 고유 title·description, og 5종, viewport, 파비콘(절대 경로), 필요 시 `naver-site-verification`.
5. og:image 조건(150×150 초과·5,000바이트 이상·3:1 이하·고유 이미지).
6. 오류 페이지 상태 코드(소프트 404 없음).
7. 웹마스터도구: 소유 확인 → 사이트맵(필요 시 RSS) 제출 → URL 검사 → 리포트 기록.
