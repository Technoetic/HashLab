import { HashTable, type Strategy } from '../core/HashTable.js';
import { BaseComponent } from './BaseComponent.js';

export class HashTableViz extends BaseComponent {
  private table = new HashTable<string>(16, 'chaining');

  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · 해시 테이블 16버킷</span><span id="ht-stat" aria-live="polite"></span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          단어를 입력하면 djb2 해시 → 16으로 나눈 나머지 버킷에 카드가 들어갑니다. 같은 버킷에 두 개 이상 들어가면 충돌입니다.
        </p>
        <div class="row" style="margin-bottom:12px">
          <div class="col">
            <div class="field"><label>키 입력 후 엔터</label>
              <input type="text" id="ht-key" placeholder="apple" autocomplete="off" spellcheck="false" />
            </div>
          </div>
          <div class="col" style="display:flex;gap:8px;align-items:flex-end">
            <button class="btn" id="ht-add">추가</button>
            <button class="btn" id="ht-strategy" data-mode="chaining">충돌: Chaining</button>
            <button class="btn danger" id="ht-clear">초기화</button>
          </div>
        </div>
        <div class="bucket-grid" id="ht-grid"></div>
      </div>
    `;
    this.draw();
    const key = this.$('#ht-key') as HTMLInputElement;
    const add = this.$('#ht-add') as HTMLButtonElement;
    const strategyBtn = this.$('#ht-strategy') as HTMLButtonElement;
    const clear = this.$('#ht-clear') as HTMLButtonElement;
    const insert = () => {
      const k = key.value.trim();
      if (!k) return;
      const r = this.table.set(k, k);
      this.$('#ht-stat')!.textContent =
        r.bucket < 0
          ? `테이블 가득`
          : r.collided
            ? `버킷 ${r.bucket} 충돌! probes=${r.probes}`
            : `버킷 ${r.bucket}에 저장 (probes=${r.probes})`;
      this.draw(r.bucket, r.collided);
      key.value = '';
      key.focus();
    };
    this.on(add, 'click', insert);
    this.on(key, 'keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') insert();
    });
    this.on(strategyBtn, 'click', () => {
      const mode = strategyBtn.dataset.mode === 'chaining' ? 'open' : 'chaining';
      strategyBtn.dataset.mode = mode;
      strategyBtn.textContent = `충돌: ${mode === 'chaining' ? 'Chaining' : 'Open Addressing'}`;
      this.table = new HashTable<string>(16, mode as Strategy);
      this.draw();
    });
    this.on(clear, 'click', () => {
      this.table.clear();
      this.draw();
      this.$('#ht-stat')!.textContent = '비움';
    });
  }

  private draw(highlight = -1, collided = false): void {
    const grid = this.$('#ht-grid')!;
    grid.innerHTML = '';
    for (let i = 0; i < this.table.size; i++) {
      const cell = document.createElement('div');
      cell.className = 'bucket';
      if (i === highlight && collided) cell.classList.add('collide');
      const idx = document.createElement('div');
      idx.className = 'idx';
      idx.textContent = String(i).padStart(2, '0');
      cell.appendChild(idx);
      for (const e of this.table.buckets[i]) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = e.key;
        cell.appendChild(item);
      }
      grid.appendChild(cell);
    }
  }
}
