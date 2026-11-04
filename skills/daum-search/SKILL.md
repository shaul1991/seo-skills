---
name: daum-search
description: >-
  Daum(카카오) 검색 대응: Daum 웹문서 수집 로봇(Daum/4.1, robots.txt 이름 Daum)과 링크 미리보기 로봇(Daum-Preview/1.0),
  Daum 검색등록(사이트 등록), Daum 웹마스터도구 Beta PIN, 웹문서 미노출 점검, 사이트 연관 채널(sameAs), 카카오톡 채널 연결,
  카카오맵 매장관리. "다음 검색", "Daum 검색 등록", "다음 웹마스터도구", "카카오 검색 노출" 요청에 사용.
---

# Daum(카카오) 검색

근거: [Daum 고객센터 검색 도움말](https://cs.daum.net/faq/service/15/category/9334) (2026-11-04 확인). Daum 웹마스터도구(`webmaster.daum.net`)는 로그인이 필요해 내부 화면은 확인하지 못했습니다.

## 로봇

| 로봇 | 용도 | User-Agent 구분 문자열 | robots.txt 이름 |
| --- | --- | --- | --- |
| Daum 크롤러 | Daum 웹문서 검색용 수집 | `Daum/4.1` (예: `Mozilla/5.0 (compatible; Daum/4.1; +https://cs.daum.net/faq/service/15/category/4118/detail/28966)`) | `Daum` (대소문자 무관) |
| Daum Preview | Daum 서비스에서 입력·공유된 링크 미리보기 | `Daum-Preview/1.0` | 문서에 robots 이름 없음 |

- robotstxt.org 규칙을 따르고, 규칙 변경을 빠르게 반영한다고 밝힙니다. UA 세부 형식은 예고 없이 바뀔 수 있습니다.
- Daum 검색에 안 나오거나 링크 미리보기가 안 뜨면 **방화벽·WAF가 UA나 IP로 Daum 로봇을 막는지** 먼저 봅니다(Daum 문서 권고).
- 출처: [Daum 웹문서 검색이란?](https://cs.daum.net/faq/service/15/category/4118/detail/28961)

```text
User-agent: Daum
Allow: /
Disallow: /admin/
```

## 웹문서가 안 나올 때 (Daum 점검 순서)

1. 로봇 차단 여부(robots.txt, 방화벽)
2. 응답 상태: 연결 실패·응답 지연, 4xx·5xx
3. 규제·제한 대상: 청소년 유해, **과도한 광고**, 저작권 위배, 개인정보 노출, **다른 웹문서와 중복**, 등록 후 변질·삭제(가격·판매 기간이 바뀌거나 기간이 지나면 지워지는 문서 포함), **분석이 어려운 문서(비표준 HTML, 과도한 JavaScript)**, **여러 호스트에 같은 내용**
- 일정이 지나면 사라지는 페이지(행사·공고)는 종료 후에도 URL을 유지하고 "종료" 상태로 남기는 편이 이 기준에 맞습니다(비서 판단).
- 출처: [웹문서 검색결과에 나오게 하고 싶어요](https://cs.daum.net/faq/service/15/category/4118/detail/28967)

## Daum 검색등록(사이트 등록)

- 사이트·블로그·웹문서를 **무료**로 등록하는 서비스. 검토 후 반영되며 **노출을 보장하지 않음**. 결과는 신청 이메일로 옵니다.
- 경로: 검색등록 → 등록하기 → 신규등록 → 사이트 검색 → URL 입력 → 동의 → 공통정보·신청자 정보 입력. 사업자 서류를 요구할 수 있습니다(서류 FAQ 별도).
- 출처: [검색등록 서비스란](https://cs.daum.net/faq/service/15/category/9334/detail/38555), [무료인가요](https://cs.daum.net/faq/service/15/category/9334/detail/29025), [신청 방법](https://cs.daum.net/faq/service/15/category/9334/detail/38564), [반영 시점](https://cs.daum.net/faq/service/15/category/9334/detail/29032)

## Daum 웹마스터도구 Beta

- PIN 코드(8~12자리) 발급 → 사이트 URL 입력 → 이용 동의 → URL 인증키 발급. **이용 동의 후 24개월이 지나면 초기화**되어 PIN을 다시 발급해야 합니다.
- 출처: [PIN 코드 발급 안내](https://cs.daum.net/faq/service/15/category/4118/detail/38321)

## 사이트 연관 채널

- 루트 페이지의 schema.org `Person` 또는 `Organization` + `sameAs`. 사이트 신뢰도에 따라 자동 추출하며 수집에 수개월 걸릴 수 있습니다.
- 지원 도메인(2026-11-04): 유튜브, 페이스북, 엑스, 인스타그램, 구글플레이, 애플스토어, 카카오스토리, 다음카페, 카카오TV, 티스토리, 브런치.
- 네이버 연관채널 목록과 다릅니다(네이버는 네이버 블로그·스마트스토어·카카오톡 채널 등). 같은 `sameAs` 블록에 두 목록의 실제 운영 채널을 함께 넣습니다(`structured-data`).
- 출처: [사이트 연관 채널](https://cs.daum.net/faq/service/15/category/9334/detail/38911)

## 카카오톡 채널·카카오맵

- 카카오톡 채널을 사이트 정보에 붙이려면: 채널 개설 → 검색등록의 신규등록/등록변경에서 '카카오톡 채널 URL'에 프로필 ID 입력. **소유자 확인이 필요하고, 사이트 메인 화면에 채널 아이디나 링크가 보여야** 합니다. 출처: [카카오톡 채널 추가](https://cs.daum.net/faq/service/15/category/9334/detail/34269)
- 오프라인 장소 정보는 검색등록이 아니라 **카카오맵 매장관리** 서비스에서 등록·관리합니다. 출처: [카카오맵 지역정보](https://cs.daum.net/faq/service/15/category/9334/detail/38557)
