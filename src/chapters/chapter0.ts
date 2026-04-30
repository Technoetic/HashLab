import { HashPlayground } from '../components/HashPlayground.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter0: ChapterDef = {
  id: 'welcome',
  num: 0,
  title: '환영합니다 — 1분 미리보기',
  lead: '아래 박스에 아무 글자나 입력해 보세요. 길든 짧든 결과는 항상 64자 hex.',
  duration: '1분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>해시 함수는 <strong>"입력의 길이와 상관없이 항상 같은 길이의 결과"</strong>를 만들어 줍니다.
        결과만 보고는 원본을 알 수 없고, 원본이 1글자만 바뀌어도 결과는 완전히 달라집니다.</p>
        <p>이 작은 마법 한 가지가 카카오톡, 비밀번호 저장, Git, 블록체인, IPFS, CDN 캐시까지
        — 인터넷의 골격을 떠받치고 있어요. 30분만 함께 만져 봅시다.</p>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new HashPlayground(slot);
    c.render();
    return [c];
  },
};
