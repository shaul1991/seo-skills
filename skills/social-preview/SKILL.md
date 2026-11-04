---
name: social-preview
description: >-
  링크 공유 미리보기 메타 태그: Open Graph(og:*), X/Twitter 카드(twitter:card, summary_large_image), 카카오톡 공유·링크 미리보기,
  Facebook·Instagram·Threads·Messenger(Meta), Daum 링크 미리보기, 네이버 og:image 조건. 미리보기가 안 나오거나 오래된 이미지가 보일 때의 점검과 캐시 갱신.
  "공유 미리보기", "og 태그", "트위터 카드", "X 카드", "카카오톡 미리보기", "썸네일이 안 나와요" 요청에 사용.
---

# 공유 미리보기(Open Graph·X·카카오톡)

근거(확인 2026-11-04): [Open Graph protocol](https://ogp.me/), [Facebook 웹마스터용 공유 가이드](https://developers.facebook.com/documentation/sharing/webmasters), [Meta 웹 크롤러](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers), [카카오 방화벽 참고 정보](https://developers.kakao.com/docs/ko/reference/firewall), [Daum 로봇 안내](https://cs.daum.net/faq/service/15/category/4118/detail/28961), [네이버 콘텐츠 마크업](https://searchadvisor.naver.com/guide/markup-content), [카카오톡 공유 이해하기](https://developers.kakao.com/docs/ko/kakaotalk-share/common), X 카드 문서(아래 주의 참고).

## 기본 세트(모든 공유 페이지)

```html
<meta property="og:type" content="website">            <!-- 글·상세는 article 가능 -->
<meta property="og:title" content="<페이지 제목>">
<meta property="og:description" content="<1~2문장 설명>">
<meta property="og:image" content="https://example.com/og/<페이지별>.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<이미지 설명>">
<meta property="og:url" content="https://example.com/<canonical 경로>">
<meta property="og:site_name" content="<사이트 이름>">
<meta property="og:locale" content="ko_KR">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<페이지 제목>">
<meta name="twitter:description" content="<설명>">
<meta name="twitter:image" content="https://example.com/og/<페이지별>.jpg">
<meta name="twitter:image:alt" content="<이미지 설명>">
<meta name="twitter:site" content="@<계정>">           <!-- 계정이 있을 때만 -->
```

- `og:url`은 canonical URL과 같게 합니다(OGP: "permanent ID").
- 이미지 URL은 **절대 URL, 공개 접근 가능**(로그인·사설망·robots 차단 금지).
- 1200×630은 이 저장소의 권장 기본값(비서 판단)입니다. 아래 플랫폼별 하한을 모두 만족합니다.

## 플랫폼별 조건

| 플랫폼 | 읽는 태그 | 조건·주의 |
| --- | --- | --- |
| Open Graph 공통 | `og:title`, `og:type`, `og:image`, `og:url`(필수 4종), `og:description`, `og:site_name`, `og:locale` | `og:image:width/height/alt/type` 선택 속성 |
| 네이버 검색 | og 5종(`type`·`title`·`description`·`image`·`url`) | og:image가 검색 썸네일이 되려면 **150×150 초과, 5,000바이트 이상, 가로:세로 3:1 이하, 페이지 고유 이미지** |
| X(Twitter) | `twitter:card` 필수. 없으면 `og:title`·`og:description`·`og:image`로 대체 | 아래 X 절 |
| 카카오톡·카카오스토리 | 스크랩 서버가 og 태그로 대표 이미지·제목·설명을 만듦 | 아래 카카오 절 |
| Meta(Facebook·Instagram·Messenger·Threads) | `facebookexternalhit`이 og 태그 수집·캐시 | 아래 Meta 절 |
| Daum 서비스 | `Daum-Preview/1.0`이 링크 미리보기 생성 | 방화벽이 UA·IP로 막지 않게(`daum-search`) |

## 카카오톡

- 스크랩 서버가 URL에 접근해 주로 og 태그로 대표 이미지를 인식하고 미리보기를 만듭니다. 이미지는 최적화해 **CDN에 오래 캐시**합니다.
- 폐쇄망·IP 허용 방화벽이면 카카오가 공개한 **스크랩 메시지용 IP(2026-11-04: `211.231.103.0/24`, `27.0.238.0/24`)**를 허용합니다. 일반 환경은 설정 불필요. 바뀔 수 있으니 [방화벽 문서](https://developers.kakao.com/docs/ko/reference/firewall)를 다시 확인합니다.
- og 값·이미지를 바꿨는데 예전 미리보기가 보이면 [공유 디버거](https://developers.kakao.com/tool/debugger/sharing)(카카오 로그인 필요)에서 캐시를 초기화합니다. 스크랩 메시지·카카오스토리는 다음 공유부터, 대화창에 URL을 직접 보낸 미리보기는 기기 캐시를 지운 뒤 바뀐다고 안내된 자료가 있습니다([카카오 기술지원 블로그 2022](https://kakao-tam.tistory.com/137), `historical`).
- 이미지 URL을 바꾸는 것(파일명 또는 `?v=2`)이 가장 확실합니다. 다만 쿼리만 바꿨는데 이미지 요청이 오지 않았다는 [데브톡 사례(2026-09)](https://devtalk.kakao.com/t/og-image/151809)가 있어, 안 되면 파일명을 바꿉니다.
- 서버 로그 사례에서 스크랩 요청 UA가 `kakaotalk-scrap`으로 보고됐습니다(데브톡 사용자 글, 공식 문서 미확인).

## Meta (Facebook·Instagram·Messenger·Threads)

- `facebookexternalhit/1.1`이 공유된 링크의 제목·설명·썸네일을 수집·캐시합니다. 요구사항([Meta 웹 크롤러](https://developers.facebook.com/documentation/sharing/webmasters/web-crawlers)):
  - 서버가 **gzip·deflate** 인코딩 지원
  - og 태그가 **응답 첫 1MB 안**에 있어야 함(넘으면 잘림) → `<head>` 앞쪽에 둡니다
  - **몇 초 안에** 응답해야 표시됨
  - `Range` 헤더 요청에 필요한 속성을 포함해 응답하거나 Range를 무시
  - 차단 장비가 있으면 UA 또는 IP를 허용 목록에(IP가 더 안전)
- 흉내 내 보기:

```bash
curl -v --compressed -H "Range: bytes=0-524288" -H "Connection: close" \
  -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" "https://example.com/page"
```

- 갱신: [공유 디버거](https://developers.facebook.com/tools/debug/)에 URL을 넣어 다시 수집합니다.
- Threads 전용 미리보기 문서는 찾지 못했습니다. Meta 앱 패밀리 공유를 facebookexternalhit이 담당한다는 위 문서를 근거로 같은 og 태그를 씁니다.
- AI 관련 Meta 크롤러(`meta-webindexer`, `meta-externalagent` 등)는 `ai-crawlers`.

## X(Twitter) 카드

⚠️ 2026-11-04 현재 X의 카드 문서는 developer.x.com에서 docs.x.com 개요로 이동되고, docs.x.com 사이트맵에 카드 문서가 없습니다. 아래는 [Internet Archive의 2026-02 사본](https://web.archive.org/web/20260204074639/https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image)과 [문제 해결 사본(2026-01)](https://web.archive.org/web/20260124210156/https://developer.x.com/en/docs/x-for-websites/cards/guides/troubleshooting-cards) 기준의 **과거 자료**입니다. 실제 표시는 X에 링크를 올려 확인합니다.

- `twitter:card`: `summary_large_image`(큰 이미지) 또는 `summary`.
- `twitter:title` 필수(모바일 2줄, 웹 1줄로 잘림), `twitter:description`(웹 3줄, 모바일 미표시, 제목 반복 금지), `twitter:image`(사이트 로고 같은 공통 이미지 말고 페이지 고유 이미지), `twitter:image:alt`(최대 420자).
- 크롤러 `Twitterbot`: robots.txt에서 막지 않습니다(`User-agent: Twitterbot` / `Disallow:`). TLS 1.1 이상 필요. 이미지는 보통 5MB까지 내려받고, 144×144 미만은 권장 크기 미달.
- 네이버 가이드 예시에는 `twitter:domain`도 있습니다(X 공식 필수 태그 아님).

## 점검 순서

1. 서버 HTML의 `<head>`에 og·twitter 태그가 있는지(클라이언트 JS로만 넣으면 대부분의 미리보기 크롤러가 못 읽음 — 일반적 관찰, 플랫폼별 보장 없음).
2. `og:url` = canonical, 이미지 절대 URL, 이미지 HTTP 200·공개.
3. 이미지 크기·용량·비율(네이버 조건, X 5MB·144px).
4. robots.txt가 `Twitterbot`, `facebookexternalhit`, 네이버 Yeti, `Daum`을 막지 않는지. 방화벽·CDN 봇 차단이 카카오 스크랩 서버·Daum-Preview·facebookexternalhit·Twitterbot을 막지 않는지.
5. og 태그가 HTML 앞쪽(첫 1MB 안)에 있고 gzip 응답이 되는지(Meta).
6. 캐시: 이미지를 바꿔도 이전 미리보기가 남을 수 있습니다. 이미지 URL을 바꾸거나(파일명·쿼리), 플랫폼 도구로 다시 읽게 합니다.
   - 카카오: [공유 디버거](https://developers.kakao.com/tool/debugger/sharing)(카카오 로그인 필요, 위 카카오 절)
   - Facebook: [공유 디버거](https://developers.facebook.com/tools/debug/)
   - X: 카드 검증 도구의 현재 제공 여부 미확인 — 실제 게시로 확인

```bash
node <seo-orchestrator 폴더>/scripts/seo-check.mjs https://example.com/page   # og·twitter 태그, 이미지 절대 URL·크기 확인
```
