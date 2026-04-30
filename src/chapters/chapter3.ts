import { PasswordDemo } from '../components/PasswordDemo.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter3: ChapterDef = {
  id: 'password',
  num: 3,
  title: '대중 앱 사례 ① 비밀번호 저장',
  lead: '여러분의 비번은 회사도 모르는 게 정상입니다.',
  duration: '4분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>회원가입할 때 입력한 비밀번호는 <strong>절대 평문으로 저장되면 안 됩니다</strong>.
        대신 해시(+ 무작위 salt)만 저장합니다. 로그인할 때는 입력값을 같은 방식으로 해시해서 DB의 해시와 비교하면 됩니다.
        이 방식 덕분에 회사 DB가 털려도 사용자 비밀번호는 직접 노출되지 않습니다.</p>

        <h3>실제 서비스가 쓰는 방식</h3>
        <ul>
          <li><strong>bcrypt</strong> — 1999년부터 쓰여 온 표준. 작업 비용 조절(saltRounds).</li>
          <li><strong>Argon2</strong> — 2015년 PHC 우승자. 메모리도 많이 먹어 GPU 공격에 강함.</li>
          <li><strong>scrypt</strong> — 라이트코인이 마이닝에도 채택.</li>
        </ul>
        <p>아래에서 비밀번호 한 개를 세 가지 방식으로 저장해 보고, salt를 새로 만들 때마다 결과가 어떻게 달라지는지 보세요.</p>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new PasswordDemo(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <div class="callout">
        <div class="label">salt가 왜 필요해?</div>
        같은 비밀번호 <code>123456</code>을 쓴 두 사람의 해시가 같다면, 한 사람의 해시만 깨도 둘 다 노출됩니다.
        사용자마다 무작위 salt를 붙여 해시하면 같은 비번이라도 결과가 전혀 다릅니다.
      </div>
      <div class="callout warn">
        <div class="label">실수 방지</div>
        Web 앱에서 직접 SHA-256만 돌려 저장하지 마세요. <strong>느린 해시 + salt + (가능하면) pepper</strong>가 최소 기준입니다.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
