type Handler = (detail: unknown) => void;

export class EventBus {
  private map = new Map<string, Set<Handler>>();

  on(event: string, handler: Handler): () => void {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(handler);
    return () => this.map.get(event)?.delete(handler);
  }

  emit(event: string, detail: unknown): void {
    this.map.get(event)?.forEach((h) => h(detail));
  }
}

export const bus = new EventBus();
