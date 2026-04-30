import { BloomFilter } from '../core/BloomFilter.js';
import { BaseComponent } from './BaseComponent.js';

export class BloomFilterViz extends BaseComponent {
  private bf = new BloomFilter(64, 3);
  private added = new Set<string>();

  render(): void {
    this.root.innerHTML = `
      <div class="demo">
        <header><span>Demo · Bloom Filter (64 bit, k=3)</span><span id="bf-stat" aria-live="polite"></span></header>
        <p style="font-size:14px;color:var(--fg-muted);margin-bottom:12px">
          Cloudflare/Chrome Safe Browsing에서 사용하는 "확률 출입증". 추가하면 3개 비트가 점등됩니다.
          조회 시 그 3개가 모두 점등돼 있으면 <strong style="color:var(--accent)">PROBABLY YES</strong>, 하나라도 꺼져 있으면 <strong style="color:var(--accent)">DEFINITELY NO</strong>.
        </p>
        <div class="row" style="margin-bottom:12px">
          <div class="col">
            <div class="field"><label>추가</label>
              <input type="text" id="bf-add" placeholder="apple" autocomplete="off" spellcheck="false" />
            </div>
          </div>
          <div class="col">
            <div class="field"><label>조회</label>
              <input type="text" id="bf-q" placeholder="apple" autocomplete="off" spellcheck="false" />
            </div>
          </div>
          <div class="col" style="display:flex;gap:8px;align-items:flex-end">
            <button class="btn primary" id="bf-add-btn">추가</button>
            <button class="btn danger" id="bf-clear">초기화</button>
          </div>
        </div>
        <div class="bloom-grid" id="bf-grid"></div>
        <div style="font-size:12px;color:var(--fg-muted);margin-top:8px" id="bf-detail"></div>
      </div>
    `;
    this.draw();
    const addInp = this.$('#bf-add') as HTMLInputElement;
    const qInp = this.$('#bf-q') as HTMLInputElement;
    const addBtn = this.$('#bf-add-btn') as HTMLButtonElement;
    const clear = this.$('#bf-clear') as HTMLButtonElement;

    const addItem = () => {
      const v = addInp.value.trim();
      if (!v) return;
      const idxs = this.bf.add(v);
      this.added.add(v);
      this.draw(idxs);
      this.$('#bf-stat')!.textContent = `+${v} → bits ${idxs.join(', ')}`;
      addInp.value = '';
    };
    this.on(addBtn, 'click', addItem);
    this.on(addInp, 'keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') addItem();
    });
    this.on(qInp, 'input', () => {
      const v = qInp.value.trim();
      if (!v) {
        this.$('#bf-detail')!.textContent = '';
        return;
      }
      const exists = this.bf.has(v);
      const reallyAdded = this.added.has(v);
      const verdict = exists
        ? reallyAdded
          ? 'PROBABLY YES (실제로 추가됨)'
          : 'PROBABLY YES — 그러나 실제로는 미추가 (False Positive!)'
        : 'DEFINITELY NO';
      this.$('#bf-detail')!.textContent = `"${v}" 조회 → ${verdict}`;
    });
    this.on(clear, 'click', () => {
      this.bf.clear();
      this.added.clear();
      this.draw();
      this.$('#bf-stat')!.textContent = '비움';
    });
  }

  private draw(flash: number[] = []): void {
    const grid = this.$('#bf-grid')!;
    grid.innerHTML = '';
    for (let i = 0; i < this.bf.bitSize; i++) {
      const c = document.createElement('div');
      c.className = 'bloom-bit';
      if (this.bf.bits[i]) c.classList.add('on');
      if (flash.includes(i)) c.classList.add('flash');
      c.textContent = String(i);
      grid.appendChild(c);
    }
  }
}
