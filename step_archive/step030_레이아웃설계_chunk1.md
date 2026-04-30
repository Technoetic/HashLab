# Step 030 레이아웃 설계 chunk1

## Grid

```
.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 100vh;
}
.sidebar { padding: 24px 16px; border-right: 1px solid var(--line); }
.content { padding: 32px; max-width: 760px; margin: 0 auto; overflow-y: auto; }

@media (max-width: 1024px) {
  .app { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .sidebar.open { display: block; position: fixed; inset: 0; z-index: 9; background: var(--bg); }
}
```

## Z-index 계층
- 0: 콘텐츠
- 5: sticky 진행바
- 9: 모바일 사이드바 오버레이
- 99: Toast/모달

## Breakpoint
- mobile: ~640px → 1열, 햄버거
- tablet: 641~1024px → 1열, 상단 진행바
- desktop: 1025+ → 좌 사이드바 + 우 콘텐츠

## 와이어 (재확인)
이미 step025_planning_chunk3에 명시. 그대로 채택.
