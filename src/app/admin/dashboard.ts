import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-400">Full control over the BookMe platform</p>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          @for (_ of [1,2,3,4]; track _) {
            <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm animate-pulse">
              <div class="flex items-center justify-between">
                <div class="space-y-2">
                  <div class="h-3 bg-slate-200 rounded w-16"></div>
                  <div class="h-7 bg-slate-200 rounded w-12"></div>
                </div>
                <div class="h-10 w-10 rounded-xl bg-slate-200"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Users</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{{ totalUsers() }}</p>
              </div>
              <div class="h-10 w-10 rounded-xl bg-vibe-50 flex items-center justify-center text-lg">👥</div>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Services</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{{ totalServices() }}</p>
              </div>
              <div class="h-10 w-10 rounded-xl bg-vibe-50 flex items-center justify-center text-lg">🛠️</div>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Subscriptions</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{{ totalSubscriptions() }}</p>
              </div>
              <div class="h-10 w-10 rounded-xl bg-vibe-50 flex items-center justify-center text-lg">📋</div>
            </div>
          </div>
          <div class="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Revenue</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">\${{ totalRevenue() }}</p>
              </div>
              <div class="h-10 w-10 rounded-xl bg-vibe-50 flex items-center justify-center text-lg">💰</div>
            </div>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (card of cards; track card.route) {
          <a [routerLink]="[card.route]"
            class="group rounded-2xl bg-white p-6 border border-slate-100 shadow-sm hover:border-vibe-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div class="h-12 w-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-200"
              [class]="card.color">
              {{ card.icon }}
            </div>
            <h3 class="mt-4 text-base font-bold text-slate-900 group-hover:text-vibe-700 transition-colors">{{ card.label }}</h3>
            <p class="mt-0.5 text-sm text-slate-400">{{ card.desc }}</p>
          </a>
        }
      </div>
    </div>
  `,
})
export class AdminDashboard implements OnInit {
  private readonly api = inject(ApiService);

  readonly totalUsers = signal(0);
  readonly totalServices = signal(0);
  readonly totalSubscriptions = signal(0);
  readonly totalRevenue = signal('0.00');
  readonly loading = signal(true);

  readonly cards = [
    { label: 'Users', route: '/admin/users', icon: '👥', desc: 'Manage all platform users', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
    { label: 'Services', route: '/admin/services', icon: '🛠️', desc: 'View and manage all services', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
    { label: 'Categories', route: '/admin/categories', icon: '📂', desc: 'Organize service categories', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
    { label: 'Cities', route: '/admin/cities', icon: '🏙️', desc: 'Manage service locations', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
    { label: 'Plans', route: '/admin/plans', icon: '⭐', desc: 'Subscription plan management', color: 'bg-amber-50 group-hover:bg-amber-100' },
    { label: 'Subscriptions', route: '/admin/subscriptions', icon: '📋', desc: 'View all provider subscriptions', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
    { label: 'Payments', route: '/admin/payments', icon: '💳', desc: 'View payment transactions', color: 'bg-vibe-50 group-hover:bg-vibe-100' },
  ];

  ngOnInit(): void { this.loadStats(); }

  private loadStats(): void {
    this.loading.set(true);
    let pending = 4;
    const done = () => { pending--; if (pending === 0) this.loading.set(false); };
    this.api.getAllActiveUsers().subscribe({
      next: (res) => { this.totalUsers.set(res.data.length); done(); },
      error: () => done(),
    });
    this.api.getAllActiveServices().subscribe({
      next: (res) => { this.totalServices.set(res.data.length); done(); },
      error: () => done(),
    });
    this.api.getAllSubscriptions().subscribe({
      next: (res) => { this.totalSubscriptions.set(res.data.length); done(); },
      error: () => done(),
    });
    this.api.getAllPayments({ pageNumber: 1, pageSize: 10000 }).subscribe({
      next: (res) => {
        const sum = res.data.data.reduce((acc, p) => acc + (p.amount || 0), 0);
        this.totalRevenue.set(sum.toFixed(2));
        done();
      },
      error: () => done(),
    });
  }
}
