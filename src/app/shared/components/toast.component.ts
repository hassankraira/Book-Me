import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [class]="'flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-white min-w-[280px] animate-slide-up ' + bgClass(toast.type)"
          role="alert">
          <span class="text-lg">{{ icon(toast.type) }}</span>
          <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
          <button (click)="toastService.remove(toast.id)" class="text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slide-up 0.3s ease-out; }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  bgClass(type: string): string {
    switch (type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      default: return 'bg-vibe-600';
    }
  }

  icon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  }
}
