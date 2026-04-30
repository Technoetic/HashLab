import { MiningSim } from '../components/MiningSim.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter7: ChapterDef = {
  id: 'bitcoin',
  num: 7,
  title: '대중 앱 사례 ④ 비트코인 마이닝',
  lead: '"앞 0이 N개"가 나올 때까지 nonce를 굴려 찾는 게임.',
  duration: '4분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>비트코인 채굴은 본질적으로 <strong>해시 복권</strong>입니다.
        블록 데이터에 nonce(임의의 숫자)를 붙이고 SHA-256을 두 번 돌렸을 때, 결과가 "앞에 0이 N개" 시작하면 당첨.
        N이 1 늘 때마다 평균 시도 수가 16배(= hex 한 자리) 늘어납니다.</p>

        <h3>왜 해시여야 할까?</h3>
        <ul>
          <li>역으로 nonce를 추측할 수 없음 → 운에 의존</li>
          <li>검증은 한 번의 해시로 끝 → 누구나 즉시 확인</li>
          <li>난이도 조절이 단순 → 0의 개수만 바꾸면 됨</li>
        </ul>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new MiningSim(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <div class="callout warn">
        <div class="label">현실 비교</div>
        실제 비트코인은 N이 약 19~20 (앞에 0이 19~20개). 평균 10분에 한 번 발견되도록 자동 조절됩니다.
        지금 이 데모에서 N=6만 돼도 노트북에서는 한참 걸리죠.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
