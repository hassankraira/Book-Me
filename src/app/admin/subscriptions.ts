import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { Subscription } from '../core/models';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Subscriptions</h1>
          <p class="mt-1 text-sm text-slate-400">Overview of all provider subscriptions</p>
        </div>
      </div>

      @if (loading()) {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 space-y-4 animate-pulse">
            @for (_ of [1,2,3,4]; track _) {
              <div class="flex items-center gap-4">
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Provider</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Plan</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Start Date</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">End Date</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                @for (s of subscriptions(); track s.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-slate-900">{{ s.providerName || s.serviceProviderId }}</td>
                    <td class="px-6 py-4 text-slate-600">{{ s.subscriptionTypeName || 'Plan' }}</td>
                    <td class="px-6 py-4 text-slate-500">{{ s.startDate | date:'mediumDate' }}</td>
                    <td class="px-6 py-4 text-slate-500">{{ s.endDate | date:'mediumDate' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        [class]="s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        <span class="h-1.5 w-1.5 rounded-full" [class]="s.isActive ? 'bg-green-500' : 'bg-red-500'"></span>
                        {{ s.isActive ? 'Active' : 'Inactive' }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="px-6 py-16 text-center text-slate-400">No subscriptions</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <p class="text-sm text-slate-400">Page {{ page() }} · {{ subscriptions().length }} subscription{{ subscriptions().length !== 1 ? 's' : '' }}</p>
          <div class="flex gap-2">
            <button (click)="prevPage()" [disabled]="page() <= 1"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            <button (click)="nextPage()" [disabled]="!hasMore()"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminSubscriptions implements OnInit {
  private readonly api = inject(ApiService);

  readonly subscriptions = signal<Subscription[]>([]);
  readonly loading = signal(false);
  readonly page = signal(1);
  readonly hasMore = signal(false);

  ngOnInit(): void { this.loadData(); }

  private loadData(): void {
    this.loading.set(true);
    this.api.getSubscriptionsWithPagination(this.page(), 10).subscribe({
      next: (res) => {
        this.subscriptions.set(res.data);
        this.hasMore.set(res.data.length >= 10);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  nextPage(): void { this.page.update((p) => p + 1); this.loadData(); }
  prevPage(): void { if (this.page() > 1) { this.page.update((p) => p - 1); this.loadData(); } }
}
