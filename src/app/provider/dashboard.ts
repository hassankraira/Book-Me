import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ApiService } from '../core/services/api.service';
import { Booking } from '../core/models';

@Component({
  selector: 'app-provider-dashboard',
  imports: [RouterLink],
  template: `
    <div class="p-4 sm:p-6 lg:p-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p class="text-sm text-slate-500 mt-1">Welcome back, {{ auth.userName() }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-vibe-50 to-vibe-100 flex items-center justify-center text-base">🛠️</div>
            <div>
              <p class="text-xs text-slate-400">Your Services</p>
              <p class="text-xl font-bold text-slate-900">{{ servicesCount() }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-base">📅</div>
            <div>
              <p class="text-xs text-slate-400">Pending Bookings</p>
              <p class="text-xl font-bold text-slate-900">{{ pendingCount() }}</p>
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-sm border border-slate-100">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-base">⭐</div>
            <div>
              <p class="text-xs text-slate-400">Subscription</p>
              <p class="text-base font-bold" [class]="subValid() ? 'text-emerald-600' : 'text-rose-600'">{{ subValid() ? 'Active' : 'Expired' }}</p>
            </div>
          </div>
        </div>
      </div>

      @if (recentBookings().length > 0) {
        <div class="rounded-xl bg-white shadow-sm border border-slate-100 mb-8">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 class="text-base font-bold text-slate-900">Recent Bookings</h2>
            <a routerLink="/dashboard/bookings" class="text-sm font-medium text-vibe-600 hover:text-vibe-700">View All &rarr;</a>
          </div>
          <div class="divide-y divide-slate-50">
            @for (b of recentBookings(); track b.bookingId) {
              <div class="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="text-base shrink-0">{{ statusIcon(b.status) }}</span>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ b.serviceName }}</p>
                    <p class="text-xs text-slate-400">{{ b.customerName }} &bull; {{ formatDate(b.startDateTime) }} {{ formatTime(b.startDateTime) }}</p>
                  </div>
                </div>
                <span [class]="'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ' + statusClass(b.status)">{{ statusLabel(b.status) }}</span>
              </div>
            }
          </div>
        </div>
      }

      <h2 class="text-base font-bold text-slate-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a routerLink="/dashboard/services" class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-vibe-200 transition-all duration-200 group">
          <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-vibe-50 to-vibe-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🛠️</div>
          <h3 class="mt-3 text-sm font-bold text-slate-900 group-hover:text-vibe-600">My Services</h3>
          <p class="mt-0.5 text-xs text-slate-400">Add, edit or remove your services</p>
        </a>

        <a routerLink="/dashboard/Add_service" class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-vibe-200 transition-all duration-200 group">
          <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-vibe-50 to-vibe-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">➕</div>
          <h3 class="mt-3 text-sm font-bold text-slate-900 group-hover:text-vibe-600">Add Service</h3>
          <p class="mt-0.5 text-xs text-slate-400">Create a new service listing</p>
        </a>

        <a routerLink="/dashboard/bookings" class="rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-vibe-200 transition-all duration-200 group">
          <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-vibe-50 to-vibe-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📅</div>
          <h3 class="mt-3 text-sm font-bold text-slate-900 group-hover:text-vibe-600">Bookings</h3>
          <p class="mt-0.5 text-xs text-slate-400">View and manage incoming bookings</p>
        </a>
      </div>
    </div>
  `,
})
export class ProviderDashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);

  readonly servicesCount = signal(0);
  readonly pendingCount = signal(0);
  readonly subValid = signal(false);
  readonly recentBookings = signal<Booking[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.api.getAllActiveServices().subscribe({
      next: (res) => {
        const mine = res.data.filter((s) => s.serviceProviderId === this.auth.user()?.id);
        this.servicesCount.set(mine.length);
      },
    });

    this.api.checkSubscriptionValidity().subscribe({
      next: (res) => this.subValid.set(res.data ?? false),
    });

    this.api.getProviderIncomingBookings().subscribe({
      next: (res) => {
        const all = res.data;
        this.pendingCount.set(all.filter((b) => b.status === 0).length);
        this.recentBookings.set(all.slice(0, 5));
      },
    });
  }

  formatDate(iso: string): string {
    const [, m, d] = iso.split('T')[0].split('-').map(Number);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[m - 1]} ${d}`;
  }

  formatTime(iso: string): string {
    const match = iso.match(/T(\d{2}:\d{2})/);
    return match ? match[1] : iso;
  }

  statusLabel(s: number): string {
    return ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'][s] || 'Unknown';
  }

  statusIcon(s: number): string {
    return ['⏳', '✅', '❌', '↩️', '🎉'][s] || '📋';
  }

  statusClass(s: number): string {
    return (['bg-yellow-100 text-yellow-800', 'bg-green-100 text-green-800', 'bg-red-100 text-red-800', 'bg-gray-100 text-gray-800', 'bg-vibe-100 text-vibe-800'])[s] || 'bg-gray-100 text-gray-800';
  }
}
