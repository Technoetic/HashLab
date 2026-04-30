# Step 017 GitHub 조사 - 해시 함수 시각화 레포

## 핵심 항목

- 해시 함수 인터랙티브 웹 데모 레포
- Web Crypto API 사용 패턴
- 해시 테이블 시각화 알고리즘

## 참조 레포지토리(분야별 대표)

| 레포 | 핵심 패턴 | 우리 프로젝트 적용점 |
|:---|:---|:---|
| visualgo.net (visualgo) | 자료구조/알고리즘 시각화 | 해시 테이블 충돌 애니메이션 패턴 |
| algorithm-visualizer | 코드 스텝-바이-스텝 실행 | 해시 단계별 진행 UI |
| bit-aboutme/sha256-animation | SHA-256 라운드 시각화 | 라운드별 비트 변화 표시 |
| anders-sandholm/hash-visualizer | 입력→해시 매핑 차트 | 키→버킷 라인 그래프 |
| MDN web crypto example | crypto.subtle.digest | 브라우저 내장 해시 API |

## Web Crypto API 표준 패턴

```js
async function sha256(text) {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
```

- 모든 모던 브라우저 지원(Chrome 60+, FF 34+, Safari 11+)
- 비동기, Promise 기반
- 별도 라이브러리 불필요

## 충돌 시각화 알고리즘

체이닝 방식(가장 직관적):
1. 버킷 = 배열의 배열
2. insert: bucket[hash(key) % size].push({key, value})
3. 충돌 시 같은 버킷에 카드가 쌓임 → 시각적으로 "줄을 서는" 효과

오픈 어드레싱:
1. 충돌 시 다음 빈 버킷 탐색(linear/quadratic probing)
2. 시각적으로 "옆 칸을 노크하는" 효과

## 결론

레포 클론 없이 표준 패턴만 차용 가능. Web Crypto API + 순수 Canvas/SVG로 외부 의존 없음.
