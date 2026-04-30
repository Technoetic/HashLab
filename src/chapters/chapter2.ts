import { AvalancheCompare } from '../components/AvalancheCompare.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter2: ChapterDef = {
  id: 'avalanche',
  num: 2,
  title: '4대 성질과 눈사태 효과',
  lead: '한 글자만 바뀌어도 결과의 절반이 뒤집힌다 — Avalanche.',
  duration: '5분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <h3>좋은 해시 함수의 4가지 조건</h3>
        <ul>
          <li><strong>결정성</strong> — 같은 입력 → 항상 같은 출력</li>
          <li><strong>균등성</strong> — 출력이 가능한 범위에 골고루 분포</li>
          <li><strong>단방향성</strong> — 결과에서 원본을 거꾸로 못 구함</li>
          <li><strong>충돌 저항성</strong> — 다른 입력이 같은 결과를 내기 매우 어려움</li>
        </ul>

        <h3>Avalanche(눈사태) 효과</h3>
        <p>입력의 단 1비트만 바뀌어도, 좋은 해시는 출력 <strong>비트의 약 50%</strong>가 뒤집힙니다.
        직접 입력의 한 글자만 바꿔 보세요. 다른 글자는 빨갛게 표시됩니다.</p>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new AvalancheCompare(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <div class="callout">
        <div class="label">왜 중요?</div>
        Avalanche가 강해야 "비슷한 비밀번호 두 개가 비슷한 해시를 갖는" 일이 없어 공격자가 패턴으로 추측할 수 없습니다.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
