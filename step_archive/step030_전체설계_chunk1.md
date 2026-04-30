# Step 030 통합 설계 chunk1

## 핵심 문제
초보자가 "추상적 수학 함수"인 해시를 30분 안에 손으로 만져 직관적으로 이해하기.

## 제약 조건
- 외부 의존 최소화 (Web Crypto API 외부 라이브러리 없음)
- 모바일 친화 (44pt 터치, 1열 레이아웃 변환)
- AI Slop 방지 토큰(8px 그리드, 2 폰트, 1 강조색)
- Class 지향 (core/components/chapters 분리)

## ToT 설계 대안

### A안 — Vanilla TS + Vite + Class 기반 (선택)
- 번들 작음, 학습 가치 높음, 외부 의존 적음
- 직접 DOM 조작, 명시적 라이프사이클(render/destroy)
- ✓ 채택 이유: 튜토리얼 본질에 맞고 코드가 학습 자료가 된다

### B안 — Lit (Web Components)
- shadow DOM 캡슐화, 표준 기반
- 단점: 초보자 코드 가독성 저하

### C안 — React + Vite
- 단점: 프레임워크 학습 비용 + 번들 부담

→ A안 채택.

## 모듈 결정

```
src/
├── main.ts
├── styles/{tokens,reset,app}.css
├── core/{HashEngine,HashTable,BloomFilter,EventBus}.ts
├── components/{HashPlayground,AvalancheCompare,HashTableViz,
│              BloomFilterViz,MiningSim,PasswordDemo,
│              GitCommitDemo,QuizCard,BaseComponent}.ts
├── chapters/{ChapterRegistry,chapter0..chapter8}.ts
└── ui/{Sidebar,Progress,Theme}.ts

tests/
├── core/{HashEngine,HashTable,BloomFilter}.test.ts
└── components/{HashPlayground,HashTableViz}.test.ts

index.html
vite.config.ts
biome.json
.stylelintrc.json
```

## 진입점

`index.html` → `<script type="module" src="/src/main.ts">`

`main.ts` →
1. Theme 초기화
2. ChapterRegistry 등록
3. Sidebar/Progress 렌더
4. URL hash 기반 챕터 라우팅 (#chapter-0 등)
5. 첫 챕터 마운트
