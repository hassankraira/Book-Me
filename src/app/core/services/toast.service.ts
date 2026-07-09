import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();
  private nextId = 0;

  private add(message: string, type: Toast['type'], duration = 4000): void {
    const id = this.nextId++;
    this.toastsSignal.update((t) => [...t, { id, message, type }]);
    setTimeout(() => this.remove(id), duration);
  }

  success(message: string): void { this.add(message, 'success'); }
  error(message: string): void { this.add(message, 'error'); }
  info(message: string): void { this.add(message, 'info'); }
  warning(message: string): void { this.add(message, 'warning'); }

  remove(id: number): void {
    this.toastsSignal.update((t) => t.filter((toast) => toast.id !== id));
  }
}
