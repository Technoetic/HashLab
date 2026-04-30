import { HashTableViz } from '../components/HashTableViz.js';
import type { ChapterDef } from './ChapterRegistry.js';

export const chapter4: ChapterDef = {
  id: 'hashtable',
  num: 4,
  title: '대중 앱 사례 ② 해시 테이블',
  lead: 'JS 객체, Python dict, Java HashMap의 속살.',
  duration: '5분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>여러분이 매일 쓰는 자료구조 <code>{ "apple": 1500 }</code> — 이게 바로 해시 테이블입니다.
        키를 해시해서 16개 버킷 중 하나에 넣으면, 다음에 <code>apple</code>로 조회할 때 같은 버킷만 들여다보면 끝.
        100만 개 사이에서도 평균 <strong>O(1)</strong> 시간에 답을 줍니다.</p>

        <h3>핵심 단계</h3>
        <ul>
          <li>① 키 → 해시 함수 → 큰 정수</li>
          <li>② 정수 mod 버킷 수 → 인덱스</li>
          <li>③ 그 버킷에 키-값 쌍 저장</li>
        </ul>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new HashTableViz(slot);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <h3>충돌은 피할 수 없다</h3>
      <p>버킷이 16개뿐인데 단어를 17개 넣으면 <strong>비둘기집 원리</strong>로 반드시 충돌이 일어납니다.
      해결책 두 가지를 다음 챕터에서 비교합니다.</p>
    `;
    content.appendChild(after);
    return [c];
  },
};
