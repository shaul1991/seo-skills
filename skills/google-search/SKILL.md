---
name: google-search
description: >-
  Google 검색 SEO 점검·구현: 크롤링(robots.txt), 색인, JavaScript 사이트, canonical, 사이트맵, 제목 링크(title), 메타 설명·스니펫,
  사이트 이름(WebSite), AI 개요·AI 모드, 스팸 정책, Search Console. "구글 검색에 안 나와요", "구글 SEO", "Search Console",
  "title 태그", "canonical", "사이트맵", "AI Overviews" 요청에 사용. Google Search Central based technical and on-page SEO.
---

# Google 검색

근거: Google Search Central 한국어 문서(2026-11-04 확인). 링크는 각 절 끝에 있습니다. 정책이 판단을 좌우하면 원문을 다시 엽니다.

## 크롤링·색인

- **robots.txt:** 사이트 루트에 둡니다. 크롤링 제어용이며 색인 차단 수단이 아닙니다. 색인에서 빼려면 크롤링은 허용하고 `noindex`를 씁니다. robots.txt에 `Sitemap: https://example.com/sitemap.xml` 줄을 넣을 수 있고 개수 제한은 없습니다.
- **CDN·호스팅:** robots.txt뿐 아니라 CDN·방화벽이 Googlebot을 막지 않는지 확인합니다(AI 기능 문서가 명시).
- **JavaScript:** 초기 HTML에 본문이 없으면 Google이 렌더링해야 볼 수 있습니다. 목록·상세 본문은 서버 HTML(SSR/SSG)로 줍니다. 링크는 `<a href="/path">` 형태로, `#/products` 같은 fragment 라우팅은 쓰지 않습니다. 오류 페이지는 404 상태 코드 또는 `noindex`.
- **중요 정보는 텍스트로:** 이미지 속 글자만으로 핵심 정보를 전달하지 않습니다.
- 출처: [robots.txt 소개](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=ko), [JavaScript SEO 기본](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics?hl=ko)

## canonical(표준 URL)

| 방법 | Google 문서의 신호 강도 |
| --- | --- |
| 리디렉션(301 등) | 강함 |
| `<link rel="canonical">` 또는 HTTP 헤더 | 강함 |
| 사이트맵에 포함 | 약함 |

- 여러 방법을 함께 쓰면 원하는 표준 URL이 선택될 가능성이 높아집니다. 필터·정렬 파라미터 URL은 대표 URL을 canonical로 지정합니다.
- 출처: [표준 URL 지정](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls?hl=ko)

## 사이트맵

- 파일 1개당 비압축 50MB 또는 URL 50,000개. 넘으면 나누고 사이트맵 색인 파일을 씁니다.
- Google은 `<priority>`, `<changefreq>`를 무시합니다. `<lastmod>`는 일관되고 정확하다고 확인될 때 씁니다 — 본문·구조화 데이터·링크가 바뀐 날짜만 반영하고, 빌드할 때마다 현재 시각을 넣지 않습니다.
- 출처: [사이트맵 만들기](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=ko)

## 제목 링크(`<title>`)

- 페이지마다 고유하고 구체적으로. "홈", "상세" 같은 모호한 제목, 같은 상용구 반복, 키워드 나열을 피합니다.
- 사이트 이름은 시작이나 끝에 구분자(` - `, ` | `, `: `)로 붙입니다. 예: `서울 베이비페어 2026년 12월 일정 | 사이트명`
- 페이지의 시각적 기본 제목(h1)이 하나로 분명해야 합니다. Google은 `<title>` 외에 h1, `og:title` 등도 참고해 제목 링크를 만듭니다.
- 해마다 같은 페이지를 쓰면 제목의 연도·날짜를 갱신합니다.
- 출처: [제목 링크](https://developers.google.com/search/docs/appearance/title-link?hl=ko)

## 메타 설명·스니펫

- 스니펫은 주로 본문에서 자동 생성되고, 메타 설명이 더 정확하면 그것을 쓰기도 합니다. 수동 지정은 불가능합니다.
- 페이지마다 고유한 설명, 본문과 일치하는 구체 정보(날짜·장소 등)를 넣습니다. 템플릿으로 생성해도 되지만 페이지별 값이 들어가야 합니다.
- 제어: `nosnippet`, `data-nosnippet`, `max-snippet:[number]`, `noindex`.
- 출처: [메타 설명 작성](https://developers.google.com/search/docs/appearance/snippet?hl=ko)

## 사이트 이름

- 홈페이지에 `WebSite` 구조화 데이터(`name`, 필요하면 `alternateName`, `url`)를 넣습니다(`structured-data` 참고). `og:site_name`, `<title>`, 홈페이지 제목과 같은 이름을 씁니다.
- 도메인 수준 홈페이지(`https://example.com`, `https://www.example.com`, `https://m.example.com`)에서 지원됩니다.
- 출처: [사이트 이름](https://developers.google.com/search/docs/appearance/site-names?hl=ko)

## AI 개요·AI 모드

- Google 문서: AI 기능에 표시되기 위한 **추가 요구사항이나 특별한 최적화는 없습니다.** 색인되어 스니펫과 함께 표시될 수 있으면 됩니다. AI 전용 텍스트 파일·마크업·추가 schema.org도 필요 없다고 명시합니다.
- 유효한 기본기: 크롤링 허용(robots.txt·CDN), 내부 링크, 텍스트로 된 핵심 정보, 보이는 텍스트와 일치하는 구조화 데이터, 좋은 페이지 경험.
- 측정: Search Console 실적 보고서의 '웹' 검색 유형에 포함됩니다.
- 제어: `nosnippet`, `data-nosnippet`, `max-snippet`, `noindex`. Google의 다른 AI 학습·그라운딩 제한은 `Google-Extended`.
- 출처: [AI 기능 및 웹사이트](https://developers.google.com/search/docs/appearance/ai-features?hl=ko)

## 스팸 정책(피할 것)

클로킹, 도어웨이, 만료 도메인 악용, 숨겨진 텍스트·링크, 유인 키워드 반복, 링크 스팸, **확장된 콘텐츠 악용**(생성 방법과 관계없이 순위 조작 목적으로 가치 없는 페이지를 대량 생성), 스크래핑, 사이트 평판(인지도) 악용, 부적절한 리디렉션, 빈약한 제휴 페이지. 대량 페이지는 `scaled-pages`를 따릅니다.
- 출처: [스팸 정책](https://developers.google.com/search/docs/essentials/spam-policies?hl=ko), [유용한 콘텐츠 만들기](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=ko)

## Search Console

1. 도메인 또는 URL 접두어 속성으로 소유 확인.
2. 사이트맵 제출(robots.txt의 `Sitemap:`과 함께).
3. URL 검사로 Google이 보는 HTML·색인 상태 확인, 필요 시 색인 요청.
4. 리치 결과 테스트로 구조화 데이터 확인.
5. 실적 보고서에서 검색어·페이지별 노출/클릭/CTR/게재순위를 주 단위로 기록.

- 반영에는 며칠~몇 주가 걸릴 수 있고 색인은 보장되지 않습니다.
- 출처: [SEO 기본 가이드](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=ko)
