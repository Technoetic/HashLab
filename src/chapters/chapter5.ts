import { BloomFilterViz } from '../components/BloomFilterViz.js';
import { HashTableViz } from '../components/HashTableViz.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter5: ChapterDef = {
  id: 'collision',
  num: 5,
  title: '충돌 처리 + Bloom Filter',
  lead: 'Chaining vs Open Addressing, 그리고 "확률 출입증".',
  duration: '5분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <h3>두 가지 충돌 처리</h3>
        <ul>
          <li><strong>Chaining(체이닝)</strong> — 같은 버킷에 쌓는다. 직관적.</li>
          <li><strong>Open Addressing(개방 주소법)</strong> — 충돌 시 옆 칸을 노크. 캐시 친화적.</li>
        </ul>
        <p>아래에서 토글 버튼을 눌러 두 모드를 비교해 보세요.</p>
      </div>
    `;
    const slot1 = document.createElement('div');
    content.appendChild(slot1);
    const c1 = new HashTableViz(slot1);
    c1.render();

    const mid = document.createElement('div');
    mid.className = 'prose';
    mid.innerHTML = `
      <h3>Bloom Filter — 확률로 빠르게 거르기</h3>
      <p>Cloudflare가 "이 도메인이 멀웨어 목록에 있나?" 같은 질문에 거대한 DB를 다 뒤지지 않고 답하는 방법.
      <strong>없으면 100% 확신</strong>, 있으면 "아마도(false positive 가능)" 라고만 답합니다.</p>
    `;
    content.appendChild(mid);

    const slot2 = document.createElement('div');
    content.appendChild(slot2);
    const c2 = new BloomFilterViz(slot2);
    c2.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <div class="callout">
        <div class="label">실전 사용처</div>
        Chrome Safe Browsing(악성 URL 사전 필터), Cassandra/HBase(디스크 조회 회피), Cloudflare(레이트 리미팅) 등.
      </div>
    `;
    content.appendChild(after);
    return [c1, c2];
  },
};
