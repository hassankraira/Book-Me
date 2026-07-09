import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    @if (totalPages() > 1) {
      <div class="flex items-center justify-center gap-2 mt-8">
        <button
          [disabled]="currentPage() <= 1"
          (click)="pageChange.emit(currentPage() - 1)"
          class="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40 hover:bg-gray-100">
          Previous
        </button>

        @for (p of pages(); track p) {
          <button
            (click)="pageChange.emit(p)"
            [class]="'rounded-lg px-3 py-2 text-sm font-medium ' + (p === currentPage() ? 'bg-vibe-600 text-white' : 'border hover:bg-gray-100')">
            {{ p }}
          </button>
        }

        <button
          [disabled]="currentPage() >= totalPages()"
          (click)="pageChange.emit(currentPage() + 1)"
          class="rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-40 hover:bg-gray-100">
          Next
        </button>
      </div>
    }
  `,
})
export class PaginationComponent {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();

  protected pages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const visible: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) visible.push(i);
    return visible;
  }
}
