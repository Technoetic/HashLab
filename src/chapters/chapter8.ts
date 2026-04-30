import { QuizCard, type QuizItem } from '../components/QuizCard.js';
import type { ChapterDef } from './ChapterRegistry.js';

const items: QuizItem[] = [
  {
    q: '해시 함수의 결과 길이는 입력 길이에 따라 어떻게 변하는가?',
    options: ['입력이 길수록 길어진다', '항상 고정 길이', '입력이 짧으면 짧아진다', '랜덤하게 변한다'],
    answer: 1,
    explain: '해시는 입력 길이와 무관하게 알고리즘별 고정 길이(SHA-256은 256bit/64hex)를 출력합니다.',
  },
  {
    q: '비밀번호 저장 표준에 가장 가까운 것은?',
    options: ['평문 저장', '단순 SHA-256', 'bcrypt(salt + 느린 해시)', 'Base64 인코딩'],
    answer: 2,
    explain: 'bcrypt/Argon2 같은 "느린 해시 + salt"가 표준입니다. 평문/단순해시/Base64는 모두 위험.',
  },
  {
    q: 'Avalanche 효과란?',
    options: [
      '해시 결과가 항상 0으로 시작',
      '입력의 1비트 변화로 출력의 절반이 뒤집힘',
      '같은 입력에 다른 결과',
      '결과 길이가 무한정 늘어남',
    ],
    answer: 1,
    explain: '좋은 해시는 입력 1비트만 바뀌어도 출력 비트의 약 50%가 뒤집힙니다.',
  },
  {
    q: 'Git 커밋 ID는 무엇으로 만들어지나?',
    options: ['랜덤 UUID', 'AES 암호화', 'SHA-1 해시', '단순 카운터'],
    answer: 2,
    explain: 'Git은 (이전 커밋 + 트리 + 메타데이터)의 SHA-1을 커밋 ID로 사용합니다(SHA-256 전환 진행 중).',
  },
  {
    q: 'Bloom Filter가 "PROBABLY YES"라고 답할 때 의미는?',
    options: [
      '확실히 들어 있다',
      '확실히 없다',
      '있을 수 있고 없을 수도 있음(false positive 가능)',
      '데이터가 손상됨',
    ],
    answer: 2,
    explain: 'Bloom Filter는 "없으면 100% 없음", "있으면 아마도" 답하는 구조입니다.',
  },
];

export const chapter8: ChapterDef = {
  id: 'quiz',
  num: 8,
  title: '마무리 퀴즈 5문항',
  lead: '한 번 더 짚어 봅시다.',
  duration: '2분',
  build(content) {
    content.innerHTML = `
      <div class="prose">
        <p>여기까지 따라온 분이라면 다섯 문항 모두 맞히실 거예요. 틀려도 즉시 해설을 보여 드립니다.</p>
      </div>
    `;
    const slot = document.createElement('div');
    content.appendChild(slot);
    const c = new QuizCard(slot, items);
    c.render();

    const after = document.createElement('div');
    after.className = 'prose';
    after.innerHTML = `
      <h3>이 다음에는?</h3>
      <ul>
        <li>HMAC, 머클 트리, KDF(키 유도 함수) — 해시의 응용</li>
        <li>SHA-3, BLAKE3 — 차세대 해시 알고리즘</li>
        <li>충돌이 발견된 알고리즘들 — MD5(2004), SHA-1(2017)의 교훈</li>
      </ul>
      <div class="callout">
        <div class="label">고생 많으셨어요</div>
        해시 함수가 인터넷을 떠받치는 "지문 만드는 기계"라는 이미지가 머릿속에 남았다면 충분합니다.
      </div>
    `;
    content.appendChild(after);
    return [c];
  },
};
