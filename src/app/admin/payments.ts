import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { Payment } from '../core/models';

import { PaginationComponent } from '../shared/components/pagination.component';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Payments</h1>
          <p class="mt-1 text-sm text-slate-400">View all payment transactions</p>
        </div>
        <div class="flex gap-2">
          <input #searchInput type="text" [(ngModel)]="searchUser" (keyup.enter)="search()" name="searchUser"
            placeholder="Search by username..."
            class="w-48 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400" />
          <button (click)="search()"
            class="rounded-xl bg-vibe-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 transition-all">Search</button>
        </div>
      </div>

      @if (loading()) {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 space-y-4 animate-pulse">
            @for (_ of [1,2,3,4]; track _) {
              <div class="flex items-center gap-4">
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/5"></div>
                </div>
                <div class="h-4 bg-slate-200 rounded w-16"></div>
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
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">User</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Amount</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Date</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Description</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                @for (p of payments(); track p.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-slate-900">{{ p.userName || p.userId }}</td>
                    <td class="px-6 py-4 font-bold text-slate-900">\${{ p.amount }}</td>
                    <td class="px-6 py-4 text-slate-500">{{ p.date | date:'medium' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center rounded-full bg-vibe-100 px-2.5 py-0.5 text-xs font-semibold text-vibe-800">{{ p.status }}</span>
                    </td>
                    <td class="px-6 py-4 text-slate-500 max-w-[200px] truncate">{{ p.description }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="px-6 py-16 text-center text-slate-400">No payments</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        @if (!searchUser) {
          <app-pagination [currentPage]="page()" [totalPages]="totalPages()" (pageChange)="goToPage($event)" />
        }
      }
    </div>
  `,
})
export class AdminPayments implements OnInit {
  private readonly api = inject(ApiService);

  readonly payments = signal<Payment[]>([]);
  readonly loading = signal(false);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  searchUser = '';

  ngOnInit(): void { this.loadPayments(); }

  private loadPayments(): void {
    this.loading.set(true);
    this.api.getAllPayments({ pageNumber: this.page(), pageSize: 10 }).subscribe({
      next: (res) => { this.payments.set(res.data.data); this.totalPages.set(res.data.totalPages); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  goToPage(p: number): void { this.page.set(p); this.loadPayments(); }

  search(): void {
    if (!this.searchUser.trim()) { this.loadPayments(); return; }
    this.loading.set(true);
    this.api.getPaymentsByBranch(this.searchUser.trim()).subscribe({
      next: (res) => { this.payments.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
