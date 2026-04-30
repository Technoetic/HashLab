import { GitCommitDemo } from '../components/GitCommitDemo.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter6: ChapterDef = {
  id: 'git',
  num: 6,
  title: '대중 앱 사례 ③ Git 커밋 ID',
  lead: '코드 한 글자만 바뀌어도 커밋 해시는 완전히 달라진다.',
  duration: '3분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>Git의 모든 객체(커밋·트리·블롭)는 <strong>SHA-1 해시</strong>(최근 SHA-256 마이그레이션 진행 중)로
        식별됩니다. 그래서 누군가 과거 커밋의 한 글자를 몰래 바꾸면 그 커밋부터 모든 후손 커밋의 해시가 바뀌어
        팀원 모두가 즉시 변조를 감지할 수 있습니다.</p>
        <ul>
          <li>커밋 ID = SHA-1(이전 커밋 ID + 트리 + 작성자 + 메시지 …)</li>
          <li><code>git log --oneline</code>의 7자리 hex가 바로 그 해시 앞부분</li>
          <li>같은 내용이면 어느 컴퓨터에서 <code>git commit</code> 해도 같은 ID(타임스탬프 차이가 없을 때)</li>
        </ul>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new GitCommitDemo(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <div class="callout">
        <div class="label">파급 효과</div>
        같은 원리가 IPFS의 CID, BitTorrent의 info hash, Docker 이미지 다이제스트, npm <code>integrity</code> 필드에도 적용됩니다.
        <strong>"내용이 같으면 같은 주소"</strong> 라는 발상.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
