import { BaseComponent } from './BaseComponent.js';

export interface QuizItem {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export class QuizCard extends BaseComponent {
  constructor(
    root: HTMLElement,
    private items: QuizItem[],
  ) {
    super(root);
  }

  render(): void {
    this.root.innerHTML = `<div class="demo">
      <header><span>Demo · 마무리 퀴즈</span><span id="q-score" aria-live="polite">0 / ${this.items.length}</span></header>
      <div id="q-list"></div>
    </div>`;
    const list = this.$('#q-list')!;
    const score = this.$('#q-score')!;
    let solved = 0;
    this.items.forEach((it, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'quiz-q';
      wrap.innerHTML = `<div class="q-text">Q${i + 1}. ${it.q}</div>
        <div class="quiz-options"></div>
        <div class="quiz-feedback"></div>`;
      const opts = wrap.querySelector('.quiz-options') as HTMLElement;
      const fb = wrap.querySelector('.quiz-feedback') as HTMLElement;
      let answered = false;
      it.options.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.textContent = opt;
        b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          if (idx === it.answer) {
            b.classList.add('correct');
            fb.textContent = `✓ 정답. ${it.explain}`;
            solved++;
          } else {
            b.classList.add('wrong');
            const correct = opts.children[it.answer] as HTMLElement;
            correct.classList.add('correct');
            fb.textContent = `✗ ${it.explain}`;
          }
          score.textContent = `${solved} / ${this.items.length}`;
        });
        opts.appendChild(b);
      });
      list.appendChild(wrap);
    });
  }
}
