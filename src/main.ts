import { ChapterRegistry } from './chapters/ChapterRegistry.js';
import { chapter0 } from './chapters/chapter0.js';
import { chapter1 } from './chapters/chapter1.js';
import { chapter2 } from './chapters/chapter2.js';
import { chapter3 } from './chapters/chapter3.js';
import { chapter4 } from './chapters/chapter4.js';
import { chapter5 } from './chapters/chapter5.js';
import { chapter6 } from './chapters/chapter6.js';
import { chapter7 } from './chapters/chapter7.js';
import { chapter8 } from './chapters/chapter8.js';
import type { BaseComponent } from './components/BaseComponent.js';

const STORAGE_KEY = 'hashlab.visited';

class App {
  private registry = new ChapterRegistry();
  private activeId = 'welcome';
  private mounted: BaseComponent[] = [];
  private visited: Set<string>;

  constructor(
    private sidebar: HTMLElement,
    private content: HTMLElement,
    private menuToggle: HTMLElement,
  ) {
    [chapter0, chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8].forEach((c) =>
      this.registry.add(c),
    );
    this.visited = this.loadVisited();
  }

  start(): void {
    this.renderSidebar();
    window.addEventListener('hashchange', () => this.routeFromHash());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.go('next');
      if (e.key === 'ArrowLeft') this.go('prev');
      if (e.key === 'Escape') this.toggleSidebar(false);
    });
    this.menuToggle.addEventListener('click', () => this.toggleSidebar());
    this.routeFromHash();
  }

  private toggleSidebar(force?: boolean): void {
    const open = force ?? !this.sidebar.classList.contains('open');
    this.sidebar.classList.toggle('open', open);
    this.menuToggle.setAttribute('aria-expanded', String(open));
  }

  private routeFromHash(): void {
    const id = location.hash.replace('#', '') || this.registry.all()[0].id;
    this.mountChapter(id);
  }

  private renderSidebar(): void {
    const all = this.registry.all();
    const list = all
      .map(
        (c) => `
      <li>
        <button data-id="${c.id}">
          <span class="num">${String(c.num).padStart(2, '0')}</span>
          <span>${c.title.replace(/대중 앱 사례 [①②③④] /g, '')}</span>
        </button>
      </li>
    `,
      )
      .join('');
    this.sidebar.innerHTML = `
      <h1>HashLab</h1>
      <p class="tagline">해시 함수 30분 인터랙티브 코스</p>
      <ul class="chapter-list" id="ch-list">${list}</ul>
      <div class="progress" id="prog">
        <div><span id="prog-text">0 / ${all.length} 챕터 방문</span></div>
        <div class="bar"><div class="fill" id="prog-fill" style="width:0%"></div></div>
      </div>
    `;
    this.sidebar.querySelectorAll<HTMLButtonElement>('#ch-list button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id!;
        location.hash = id;
        if (window.matchMedia('(max-width: 1024px)').matches) this.toggleSidebar(false);
      });
    });
  }

  private mountChapter(id: string): void {
    const def = this.registry.byId(id) ?? this.registry.all()[0];
    this.activeId = def.id;
    this.visited.add(def.id);
    this.persistVisited();

    this.mounted.forEach((m) => m.destroy());
    this.mounted = [];

    this.content.innerHTML = `
      <header class="chapter-header">
        <div class="meta">CHAPTER ${String(def.num).padStart(2, '0')} · ${def.duration}</div>
        <h2>${def.title}</h2>
        <p class="lead">${def.lead}</p>
      </header>
      <div id="chapter-body"></div>
      <div class="nav-row">
        <button class="btn" id="nav-prev">◀ 이전</button>
        <button class="btn primary" id="nav-next">다음 ▶</button>
      </div>
    `;
    const body = this.content.querySelector('#chapter-body') as HTMLElement;
    this.mounted = def.build(body);

    const prevBtn = this.content.querySelector('#nav-prev') as HTMLButtonElement;
    const nextBtn = this.content.querySelector('#nav-next') as HTMLButtonElement;
    prevBtn.disabled = !this.registry.prev(def.id);
    nextBtn.disabled = !this.registry.next(def.id);
    prevBtn.addEventListener('click', () => this.go('prev'));
    nextBtn.addEventListener('click', () => this.go('next'));

    this.updateSidebarActive();
    this.updateProgress();
    this.content.scrollTop = 0;
    this.content.focus({ preventScroll: true });
  }

  private go(dir: 'prev' | 'next'): void {
    const target = dir === 'prev' ? this.registry.prev(this.activeId) : this.registry.next(this.activeId);
    if (target) location.hash = target.id;
  }

  private updateSidebarActive(): void {
    this.sidebar.querySelectorAll<HTMLButtonElement>('#ch-list button').forEach((btn) => {
      const isActive = btn.dataset.id === this.activeId;
      btn.setAttribute('aria-current', String(isActive));
    });
  }

  private updateProgress(): void {
    const total = this.registry.all().length;
    const cnt = this.visited.size;
    const text = this.sidebar.querySelector('#prog-text')!;
    const fill = this.sidebar.querySelector<HTMLElement>('#prog-fill')!;
    text.textContent = `${cnt} / ${total} 챕터 방문`;
    fill.style.width = `${Math.round((cnt / total) * 100)}%`;
  }

  private loadVisited(): Set<string> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  private persistVisited(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...this.visited]));
    } catch {
      /* ignore quota errors */
    }
  }
}

const app = new App(
  document.getElementById('sidebar')!,
  document.getElementById('content')!,
  document.getElementById('menu-toggle')!,
);
app.start();
