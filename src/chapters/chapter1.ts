import { HashPlayground } from '../components/HashPlayground.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter1: ChapterDef = {
  id: 'what',
  num: 1,
  title: '해시란 무엇인가',
  lead: '"입력 → 고정 길이 출력"이라는 한 줄 정의에서 시작합니다.',
  duration: '4분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>해시 함수 H는 임의 길이의 입력 x를 받아 <strong>고정 길이 출력 H(x)</strong>를 만듭니다.
        한국어로 줄여 부르면 "지문 만드는 기계".</p>

        <h3>입력 길이는 자유, 출력 길이는 고정</h3>
        <ul>
          <li><code>"a"</code> → SHA-256 64자</li>
          <li><code>"hello world"</code> → SHA-256 64자</li>
          <li>1GB 영화 파일 → SHA-256 64자</li>
        </ul>
        <p>아래에서 직접 입력 길이를 바꿔 가며 결과 길이가 정말 같은지 확인해 보세요.</p>

        <div class="callout">
          <div class="label">RULE</div>
          같은 입력은 <strong>언제, 어디서나, 누가 돌려도</strong> 항상 같은 결과(결정성).
        </div>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new HashPlayground(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <h3>해시 vs 암호화 vs 인코딩 — 셋은 다릅니다</h3>
      <ul>
        <li><strong>해시</strong>: 단방향. 결과에서 원본 못 구함. <code>password</code> 저장에 사용.</li>
        <li><strong>암호화</strong>: 양방향. 키 있으면 복호화. <code>https</code> 메시지 보호.</li>
        <li><strong>인코딩(Base64)</strong>: 그냥 표현 변환. 누구나 디코드 가능.</li>
      </ul>
      <div class="callout warn">
        <div class="label">초보자 함정</div>
        "해시 = 암호화"라고 생각하면 평생 헷갈립니다. 해시는 <strong>일방통행</strong>이라는 점을 기억하세요.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
