import { Injectable, signal, computed } from '@angular/core';

export interface AppNotification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly storageKey = 'bookme_notifications';
  private readonly notificationsSignal = signal<AppNotification[]>(this.load());
  readonly notifications = this.notificationsSignal.asReadonly();
  readonly unreadCount = computed(() => this.notifications().filter((n) => !n.read).length);

  private nextId = Date.now();

  add(message: string): void {
    const n: AppNotification = { id: ++this.nextId, message, date: new Date().toISOString(), read: false };
    this.notificationsSignal.update((list) => [n, ...list]);
    this.save();
  }

  markAsRead(id: number): void {
    this.notificationsSignal.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    this.save();
  }

  markAllRead(): void {
    this.notificationsSignal.update((list) => list.map((n) => ({ ...n, read: true })));
    this.save();
  }

  clearAll(): void {
    this.notificationsSignal.set([]);
    localStorage.removeItem(this.storageKey);
  }

  private load(): AppNotification[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }

  private save(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notificationsSignal()));
  }
}
