---
name: structured-data
description: >-
  JSON-LD 구조화 데이터 작성·점검: Event(행사·전시·박람회, 취소·연기 상태), Organization + sameAs(네이버 사이트 연관채널),
  WebSite(Google 사이트 이름), BreadcrumbList, ItemList. Google과 네이버의 지원 차이 포함. "구조화 데이터", "schema.org",
  "JSON-LD", "리치 결과", "Event schema", "이벤트 마크업" 요청에 사용. Structured data templates aligned to Google and Naver docs.
---

# 구조화 데이터(JSON-LD)

근거: Google Search Central 구조화 데이터 문서와 네이버 서치어드바이저 구조화된 데이터 가이드(2026-11-04 확인). 판단이 중요하면 원문을 다시 엽니다.

## 공통 원칙

- **보이는 본문과 일치하는 값만** 넣습니다. 모르는 가격·시각·재고·평점은 비워 두고 만들지 않습니다(Google AI 기능 문서도 "구조화된 데이터가 보이는 텍스트와 일치"를 권장).
- 마크업해도 리치 결과·노출은 보장되지 않습니다(Google·네이버 모두 명시).
- 형식은 JSON-LD를 기본으로 합니다(Google 지원, 네이버는 Microdata 또는 JSON-LD 권장). `<head>` 또는 `<body>`의 `<script type="application/ld+json">`.
- 검증: Google [리치 결과 테스트](https://search.google.com/test/rich-results), [Schema Markup Validator](https://validator.schema.org/)(네이버 가이드가 schema.org 도구 사용을 안내), `seo-orchestrator` Skill의 `scripts/seo-check.mjs`(JSON 파싱·필수 속성만 확인).

## 지원 차이(2026-11-04)

| 유형 | Google | 네이버 |
| --- | --- | --- |
| Event | 이벤트 검색 환경 문서 있음. ⚠️ **제공 지역 목록에 한국 없음**(오스트레일리아·브라질·캐나다·독일·인도·중남미·스페인·영국·미국) | 가이드 없음 |
| Organization/Person + sameAs | 조직 정보 | **사이트 연관채널**(루트 페이지, name·url·sameAs 필수) |
| WebSite | **사이트 이름**(홈페이지) | — |
| BreadcrumbList | 지원 | 지원(name 필수, position 선택) |
| ItemList(캐러셀) | 일부 유형만 | 캐러셀(ListItem) 가이드 있음 |

한국 대상 행사 사이트라면: Event 마크업은 정확한 데이터 정리와 다른 지역·향후 확장을 위해 둘 수 있지만, **현재 한국 Google 검색에서 이벤트 리치 결과가 나온다고 가정하지 않습니다.** 성과는 일반 검색 결과(제목·스니펫)와 Search Console로 판단합니다.

## Event (Google 기준)

규칙(Google [구조화된 이벤트 데이터](https://developers.google.com/search/docs/appearance/structured-data/event?hl=ko)):

- 이벤트마다 **고유 URL(리프 페이지)**에 마크업. 여러 이벤트를 나열한 목록·일정 페이지가 아니라 상세 페이지에.
- 필수: `name`(행사 제목. 장소명·가격·"지금 예매" 같은 홍보 문구 금지), `startDate`(ISO-8601), `location`(`Place` + `name` + `address`).
- 권장: `endDate`, `eventStatus`, `description`(날짜·장소 반복 말고 행사 내용), `image`(가로 1,920px 권장·최소 720px, 16:9·4:3·1:1 여러 장), `offers`, `organizer`, `performer`, `previousStartDate`.
- 날짜: 시간을 모르면 날짜만(`"2026-12-04"`). `T00:00:00`으로 채우지 않습니다. 시간이 있으면 UTC 오프셋 포함(`2026-12-04T10:00:00+09:00`).
- 여러 날 열리면 `startDate`·`endDate` 둘 다. 날마다 별도 티켓이 필요하면 날짜별 Event.
- 여러 장소에서 동시에 열리면 장소별 Event.
- 무료 입장이 **공식 확인된 경우만** `offers.price: 0`. 판매 전이면 `availability` 생략 가능, `validFrom`은 판매 시작 시각.
- 상태 변경 시 다른 값은 그대로 두고 `eventStatus`만 변경:
  - 취소 `EventCancelled`(startDate·location 삭제 금지)
  - 연기·날짜 미정 `EventPostponed`(원래 startDate 유지)
  - 새 날짜 확정 `EventRescheduled` + 새 `startDate`/`endDate` + 선택 `previousStartDate`
- 이벤트가 아닌 것(쿠폰, 영업시간, 할인 판매)을 Event로 표시하지 않습니다. 멤버십·초대 전용 행사는 이벤트 환경 대상이 아닙니다.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "<공식 행사명과 회차>",
  "startDate": "<YYYY-MM-DD 또는 YYYY-MM-DDThh:mm:ss+09:00>",
  "endDate": "<YYYY-MM-DD>",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "<행사장 이름>",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "<도로명 주소>",
      "addressLocality": "<시·구>",
      "addressRegion": "<시·도>",
      "postalCode": "<우편번호>",
      "addressCountry": "KR"
    }
  },
  "image": ["<https://.../16x9.jpg>", "<https://.../4x3.jpg>", "<https://.../1x1.jpg>"],
  "description": "<행사 내용 요약. 날짜·장소 반복 금지>",
  "organizer": { "@type": "Organization", "name": "<주최>", "url": "<주최 공식 URL>" }
}
</script>
```

`offers`는 가격·판매 정보가 공식 확인된 경우에만 추가합니다.

## 목록 페이지

- 지역·월 목록 페이지에는 Event를 여러 개 넣지 않습니다(Google은 단일 이벤트 페이지만 지원). 대신 `BreadcrumbList`와, 필요하면 상세 URL을 담은 `ItemList`.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "url": "https://example.com/events/<id-1>" },
    { "@type": "ListItem", "position": 2, "url": "https://example.com/events/<id-2>" }
  ]
}
</script>
```

## WebSite (Google 사이트 이름, 홈페이지만)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "<사이트 이름>",
  "alternateName": ["<약칭>"],
  "url": "https://example.com/"
}
</script>
```

`og:site_name`, 홈페이지 `<title>`과 같은 이름을 씁니다. 출처: [사이트 이름](https://developers.google.com/search/docs/appearance/site-names?hl=ko)

## Organization + sameAs (네이버 사이트 연관채널, 루트 페이지)

네이버가 분석에 쓰는 연관채널 도메인(2026-11-04): 네이버 블로그·스마트스토어·지식iN·치지직·클립, 당근·스레드·인스타그램·유튜브·카카오스토리·카카오톡 채널·티스토리·틱톡·페이스북·X(트위터). 노출은 보장되지 않습니다.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "<사이트 이름>",
  "url": "https://example.com/",
  "sameAs": [
    "https://cafe.naver.com/<카페>",
    "https://pf.kakao.com/<채널>",
    "https://x.com/<계정>"
  ]
}
</script>
```

- 실제로 운영 중인 채널만 넣습니다. 개설 전 채널 URL을 미리 넣지 않습니다.
- Daum도 같은 형식(Person/Organization + sameAs)을 쓰며 지원 도메인이 다릅니다: 유튜브, 페이스북, 엑스, 인스타그램, 구글플레이, 애플스토어, 카카오스토리, **다음카페**, 카카오TV, 티스토리, 브런치(`daum-search`). 한 블록에 두 검색엔진의 실제 채널을 함께 넣으면 됩니다.
- 네이버 카페는 위 연관채널 목록에 명시되어 있지 않습니다(2026-11-04). 넣어도 되지만 네이버가 연관채널로 쓴다고 가정하지 않습니다.
- 출처: [사이트 연관채널](https://searchadvisor.naver.com/guide/structured-data-channel)

## BreadcrumbList (Google·네이버 공통)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "<상위 분류 이름>", "item": "https://example.com/<상위>" },
    { "@type": "ListItem", "position": 2, "name": "<하위 분류 이름>", "item": "https://example.com/<상위>/<하위>" }
  ]
}
</script>
```

- 네이버: "홈", "top" 같은 일반어 대신 페이지를 설명하는 이름, 넓은 범위→구체 순서, 너무 긴 텍스트·숫자·특수문자만으로 된 이름 금지.
- 출처: [네이버 BreadcrumbList](https://searchadvisor.naver.com/guide/structured-data-breadcrumb), [Google 탐색경로](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=ko)
