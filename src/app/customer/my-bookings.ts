import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { NotificationService } from '../core/services/notification.service';
import { Booking } from '../core/models';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [RouterLink, CommonModule],
  styles: [`
    @keyframes popIn {
      from { transform: scale(0) rotate(-8deg); opacity: 0; }
      to   { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .pop-in { animation: popIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    @keyframes zoomOutGradient {
      0%   { transform: scale(1); border-radius: 2rem; opacity: 1; }
      100% { transform: scale(5); border-radius: 0; opacity: 0; }
    }
    .zoom-out-bg { animation: zoomOutGradient 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    @keyframes fadeSlideIn {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .fade-slide-in { animation: fadeSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    @keyframes expandRow {
      from { max-height: 0; opacity: 0; transform: translateY(-8px); }
      to   { max-height: 80px; opacity: 1; transform: translateY(0); }
    }
    .hour-row { animation: expandRow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
  `],
  template: `
    <div class="min-h-screen" style="background: linear-gradient(to bottom, var(--color-surface-soft), var(--color-background));">
      <div class="mx-auto max-w-4xl px-6 py-10">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-2">My <span class="gradient-text">Bookings</span></h1>
        <p class="text-slate-500 mb-8">{{ viewMode() === 'month' ? 'Tap a day to dive into your schedule' : '' }}</p>

        @if (loading()) {
          <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
            <div class="flex items-center justify-between mb-6">
              <div class="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
              <div class="h-5 w-40 bg-slate-200 animate-pulse rounded-md"></div>
              <div class="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
            </div>
            <div class="grid grid-cols-7 gap-1.5">
              @for (_ of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35]; track _) {
                <div class="h-12 rounded-xl bg-slate-200 animate-pulse"></div>
              }
            </div>
          </div>
        }

        @if (error()) {
          <div class="rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700 font-medium mb-6">{{ error() }}</div>
        }

        @if (bookings().length === 0 && !loading()) {
          <div class="text-center py-20">
            <div class="text-7xl mb-6">📅</div>
            <h2 class="text-2xl font-bold text-slate-700">No bookings yet</h2>
            <p class="text-slate-400 mt-2 mb-8">Start by browsing available services</p>
            <a routerLink="/" class="inline-flex rounded-xl bg-vibe-600 px-8 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl transition-all">
              Browse Services
            </a>
          </div>
        }

        @if (bookings().length > 0) {
          <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden relative">

            <!-- === Month Calendar === -->
            <div class="transition-all duration-300"
              [style.opacity]="viewMode() === 'day' ? '0' : '1'"
              [style.pointerEvents]="viewMode() === 'day' ? 'none' : 'auto'">
              <div class="p-6">
                <div class="flex items-center justify-between mb-6">
                  <button (click)="prevMonth()" [disabled]="viewMode() === 'day'"
                    class="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-30">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <span class="text-xl font-bold text-slate-900">{{ calMonthName() }} {{ calYear() }}</span>
                  <button (click)="nextMonth()" [disabled]="viewMode() === 'day'"
                    class="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-30">
                    <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
                <div class="grid grid-cols-7 gap-1.5 text-center mb-3">
                  @for (d of ['Mo','Tu','We','Th','Fr','Sa','Su']; track d) {
                    <div class="text-sm font-bold text-slate-400 py-1">{{ d }}</div>
                  }
                </div>
                <div class="grid grid-cols-7 gap-1.5">
                  @for (day of calDays(); track day.num + ':' + day.date) {
                    <button (click)="selectDay(day, $event)"
                      [disabled]="day.disabled || viewMode() === 'day'"
                      class="h-12 rounded-xl text-base font-semibold transition-all duration-200 relative overflow-hidden"
                      [class]="day.selected
                        ? 'bg-vibe-600 text-white shadow-md shadow-vibe-600/30'
                        : day.today
                          ? 'border-2 border-vibe-300 bg-vibe-100 text-vibe-700 hover:bg-vibe-200'
                          : day.disabled
                            ? 'text-slate-300 cursor-not-allowed'
                            : day.hasBookings
                              ? 'text-slate-900 hover:bg-vibe-50 font-bold'
                              : 'text-slate-400 hover:bg-slate-50'">
                      <span class="relative z-10">{{ day.num }}</span>
                      @if (day.hasBookings && !day.selected) {
                        <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-vibe-500"></span>
                      }
                      @if (day.today && !day.selected) {
                        <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibe-300"></span>
                      }
                    </button>
                  }
                </div>
              </div>
            </div>

            <!-- === Phase 1: Zoom in — big gradient number === -->
            @if (viewMode() === 'day' && !showDailyView() && selectedDate(); as sel) {
              <div class="absolute inset-0 z-10 flex items-center justify-center" style="background-color: color-mix(in srgb, var(--color-surface) 60%, transparent)">
                <div class="pop-in w-44 h-44 rounded-[2.5rem] bg-gradient-to-br from-vibe-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-vibe-500/50">
                  <span class="text-8xl font-black text-white drop-shadow-lg">{{ +sel.split('-')[2] }}</span>
                </div>
              </div>
            }

            <!-- === Phase 2: Zoom out — expanding gradient + daily schedule === -->
            @if (showDailyView() && selectedDate(); as selDate) {
              <div class="absolute inset-0 z-10 flex flex-col">
                <div class="zoom-out-bg absolute inset-0 bg-gradient-to-br from-vibe-500 to-purple-500 rounded-2xl"></div>
                <div class="fade-slide-in relative z-10 flex flex-col flex-1 min-h-0" [style.animationDelay]="'0.1s'">
                  <div class="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0" style="background-color: var(--color-surface)">
                    <button (click)="backToMonth()"
                      class="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all flex-shrink-0 text-sm text-slate-600">
                      ←
                    </button>
                    <div>
                      <h3 class="text-lg font-bold text-slate-900">{{ formatHeaderDate(selDate) }}</h3>
                      <p class="text-xs text-slate-500">{{ selectedDayBookings()?.length || 0 }} booking{{ selectedDayBookings()?.length !== 1 ? 's' : '' }}</p>
                    </div>
                  </div>
                  <div class="flex-1 overflow-y-auto px-5 py-3 rounded-b-2xl" style="background-color: var(--color-surface)">
                    <div class="relative">
                      <div class="absolute left-[4.5rem] top-0 bottom-0 w-px bg-slate-200"></div>
                      @for (hour of dayHours; track hour; let i = $index) {
                        <div class="hour-row relative flex items-start mb-0.5"
                          [style.animationDelay]="i * 0.025 + 's'">
                          <div class="w-16 text-right pr-4 pt-3 flex-shrink-0">
                            <span class="text-xs font-semibold text-slate-400">{{ formatHour(hour) }}</span>
                          </div>
                          @if (dayBookingsAtHour(hour); as bookingAtHour) {
                            <div class="relative ml-4 flex-1 rounded-xl p-3 border my-0.5"
                              [class]="statusBorderClass(bookingAtHour.status)">
                              <div class="flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                  <div class="flex items-center gap-1.5">
                                    <span>{{ statusIcon(bookingAtHour.status) }}</span>
                                    <h4 class="font-bold text-slate-900 text-sm truncate">{{ bookingAtHour.serviceName || 'Service' }}</h4>
                                  </div>
                                  <p class="text-xs text-slate-500 mt-0.5">{{ formatTime(bookingAtHour.startDateTime) }} - {{ formatTime(bookingAtHour.endDateTime) }}</p>
                                </div>
                                <span [class]="'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ' + statusClass(bookingAtHour.status)">
                                  {{ statusLabel(bookingAtHour.status) }}
                                </span>
                              </div>
                              @if (bookingAtHour.status === 0) {
                                <button (click)="cancel(bookingAtHour.bookingId)"
                                  class="mt-1.5 text-xs font-semibold text-rose-500 hover:text-rose-700 underline">
                                  Cancel
                                </button>
                              }
                            </div>
                          } @else {
                            <div class="ml-4 flex-1 h-10 flex items-center">
                              <span class="text-xs text-slate-300">— available</span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }

          </div>
        }
      </div>
    </div>
  `,
})
export class MyBookings implements OnInit, OnDestroy {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly notif = inject(NotificationService);
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private initialLoad = true;
  private prevStatus = new Map<number, number>();

  readonly bookings = signal<Booking[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly viewMode = signal<'month' | 'day'>('month');
  readonly showDailyView = signal(false);
  readonly calViewDate = signal(new Date());
  readonly selectedDate = signal<string | null>(null);

  readonly todayStr = new Date().toISOString().split('T')[0];
  readonly dayHours = Array.from({ length: 24 }, (_, i) => i);

  readonly calYear = computed(() => this.calViewDate().getFullYear());
  readonly calMonth = computed(() => this.calViewDate().getMonth());
  readonly calMonthName = computed(() =>
    ['January','February','March','April','May','June','July','August','September','October','November','December'][this.calMonth()]
  );

  readonly activeBookings = computed(() => this.bookings().filter((b) => b.status !== 3));

  readonly bookingsByDate = computed(() => {
    const map = new Map<string, Booking[]>();
    for (const b of this.activeBookings()) {
      const date = b.startDateTime.split('T')[0];
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push(b);
    }
    return map;
  });

  readonly calDays = computed(() => {
    const year = this.calYear();
    const month = this.calMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    let offset = startDow - 1;
    if (offset < 0) offset = 6;
    const bmap = this.bookingsByDate();
    const days: { num: number; date: string; disabled: boolean; today: boolean; selected: boolean; hasBookings: boolean }[] = [];
    const prevLast = new Date(year, month, 0);
    for (let i = offset - 1; i >= 0; i--) {
      days.push({ num: prevLast.getDate() - i, date: '', disabled: true, today: false, selected: false, hasBookings: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = date === this.todayStr;
      const hasBookings = bmap.has(date);
      const isSelected = date === this.selectedDate();
      days.push({ num: d, date, disabled: false, today: isToday, selected: isSelected, hasBookings });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ num: d, date: '', disabled: true, today: false, selected: false, hasBookings: false });
    }
    return days;
  });

  readonly selectedDayBookings = computed(() => {
    const date = this.selectedDate();
    if (!date) return null;
    return this.bookingsByDate().get(date) ?? [];
  });

  dayBookingsAtHour(hour: number): Booking | null {
    const bookings = this.selectedDayBookings();
    if (!bookings) return null;
    for (const b of bookings) {
      const startH = parseInt(b.startDateTime.match(/T(\d{2})/)![1]);
      if (startH === hour) return b;
    }
    return null;
  }

  ngOnInit(): void { this.loadBookings(); this.startPolling(); }

  ngOnDestroy(): void { this.stopPolling(); }

  private loadBookings(): void {
    this.loading.set(true);
    this.api.getCustomerBookingHistory().subscribe({
      next: (res) => {
        const incoming = res.data;
        this.detectChanges(incoming);
        this.bookings.set(incoming);
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load bookings'); this.loading.set(false); },
    });
  }

  private detectChanges(incoming: Booking[]): void {
    if (!this.initialLoad) {
      for (const b of incoming) {
        const prev = this.prevStatus.get(b.bookingId);
        if (prev !== undefined && prev !== b.status) {
          const labels = ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'];
          const msg = `${b.serviceName || 'Booking'} ${labels[b.status]?.toLowerCase() || 'updated'}`;
          this.toast.info(msg);
          this.notif.add(msg);
        }
      }
    }
    this.initialLoad = false;
    this.prevStatus.clear();
    for (const b of incoming) {
      this.prevStatus.set(b.bookingId, b.status);
    }
  }

  private startPolling(): void {
    this.pollTimer = setInterval(() => this.loadBookings(), 30000);
  }

  private stopPolling(): void {
    if (this.pollTimer) { clearInterval(this.pollTimer); this.pollTimer = null; }
  }

  selectDay(day: { date: string; disabled: boolean }, _event: MouseEvent): void {
    if (day.disabled || !day.date) return;
    this.selectedDate.set(day.date);
    this.viewMode.set('day');

    setTimeout(() => {
      this.showDailyView.set(true);
    }, 700);
  }

  backToMonth(): void {
    this.showDailyView.set(false);
    this.viewMode.set('month');
  }

  prevMonth(): void {
    const d = new Date(this.calViewDate());
    d.setMonth(d.getMonth() - 1);
    this.calViewDate.set(d);
  }

  nextMonth(): void {
    const d = new Date(this.calViewDate());
    d.setMonth(d.getMonth() + 1);
    this.calViewDate.set(d);
  }

  cancel(id: number): void {
    if (!confirm('Cancel this booking?')) return;
    this.api.cancelBooking(id).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.success('Booking cancelled');
          this.bookings.update((list) => list.filter((b) => b.bookingId !== id));
        }
      },
      error: (err) => { const msg = err?.error?.message; this.toast.error(msg || 'Failed to cancel'); },
    });
  }

  formatHour(h: number): string {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
  }

  formatHeaderDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `${days[new Date(y, m - 1, d).getDay()]}, ${months[m - 1]} ${d}, ${y}`;
  }

  formatDate(iso: string): string { return this.formatHeaderDate(iso.split('T')[0]); }
  formatTime(iso: string): string { return iso.match(/T(\d{2}:\d{2})/)![1]; }
  statusLabel(s: number): string { return ['Pending','Accepted','Rejected','Cancelled','Completed'][s] || 'Unknown'; }
  statusIcon(s: number): string { return ['⏳','✅','❌','↩️','🎉'][s] || '📋'; }
  statusClass(s: number): string {
    return (['bg-yellow-100 text-yellow-800','bg-green-100 text-green-800','bg-red-100 text-red-800','bg-gray-100 text-gray-800','bg-vibe-100 text-vibe-800'])[s] || 'bg-gray-100 text-gray-800';
  }
  statusBorderClass(s: number): string {
    return (['border-yellow-200 bg-yellow-50/50','border-green-200 bg-green-50/50','border-red-200 bg-red-50/50','border-gray-200 bg-gray-50/50','border-vibe-200 bg-vibe-50/50'])[s] || 'border-slate-200';
  }
}
