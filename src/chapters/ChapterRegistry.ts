import type { BaseComponent } from '../components/BaseComponent.js';

export interface ChapterDef {
  id: string;
  num: number;
  title: string;
  lead: string;
  duration: string;
  build(content: HTMLElement): BaseComponent[];
}

export class ChapterRegistry {
  private list: ChapterDef[] = [];

  add(c: ChapterDef): void {
    this.list.push(c);
  }
  all(): ChapterDef[] {
    return [...this.list];
  }
  byId(id: string): ChapterDef | undefined {
    return this.list.find((c) => c.id === id);
  }
  index(id: string): number {
    return this.list.findIndex((c) => c.id === id);
  }
  next(id: string): ChapterDef | undefined {
    return this.list[this.index(id) + 1];
  }
  prev(id: string): ChapterDef | undefined {
    const i = this.index(id);
    return i > 0 ? this.list[i - 1] : undefined;
  }
}
