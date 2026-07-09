import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { ServiceItem, TimeSlot, TimeSlotRange } from '../core/models';

@Component({
  selector: 'app-create-booking',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div class="mx-auto max-w-4xl px-6 py-10">
        <a routerLink="/service/{{ serviceId }}"
           class="inline-flex items-center gap-2 text-vibe-600 hover:text-vibe-700 font-semibold mb-8 group">
          <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Service
        </a>

        <h1 class="text-3xl font-bold tracking-tight text-slate-900 mb-8">Book a <span class="gradient-text">Service</span></h1>

        @if (loading() && !service()) {
          <div class="rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
            <div class="flex items-center gap-4 animate-pulse">
              <div class="h-16 w-16 rounded-2xl bg-slate-200"></div>
              <div class="space-y-2 flex-1">
                <div class="h-5 bg-slate-200 rounded-md w-1/3"></div>
                <div class="h-4 bg-slate-200 rounded-md w-1/4"></div>
              </div>
            </div>
          </div>
        }

        @if (error()) {
          <div class="rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700 font-medium mb-6">{{ error() }}</div>
        }

        @if (service(); as svc) {
          <div class="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 mb-8 border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-2xl bg-gradient-to-br from-vibe-100 to-purple-100 flex items-center justify-center text-3xl flex-shrink-0">🛠️</div>
              <div>
                <h2 class="text-xl font-bold text-slate-900">{{ svc.serviceName }}</h2>
                <div class="flex items-center gap-3 mt-1">
                  <span class="text-lg font-bold text-vibe-600">\${{ svc.price }}</span>
                  <span class="text-slate-300">|</span>
                  <span class="text-sm text-slate-500">{{ svc.estimatedDuration }} minutes</span>
                </div>
              </div>
            </div>
          </div>
        }

        @if (!auth.isAuthenticated()) {
          <div class="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-8 text-center mb-8">
            <p class="text-xl font-bold text-amber-800 mb-2">Sign in to book this service</p>
            <p class="text-amber-600 mb-6">You need an account to make a booking. It only takes a minute!</p>
            <div class="flex flex-wrap justify-center gap-3">
              <a routerLink="/auth/login" [queryParams]="{ returnUrl: '/booking/' + serviceId }"
                class="rounded-xl bg-vibe-600 px-8 py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all">
                Sign In
              </a>
              <a routerLink="/auth/register" [queryParams]="{ returnUrl: '/booking/' + serviceId }"
                class="rounded-xl border-2 border-vibe-200 px-8 py-3 font-bold text-vibe-700 hover:bg-vibe-50 transition-all">
                Create Account
              </a>
            </div>
          </div>
        }

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 p-6 border border-slate-100">
            <div class="flex items-center justify-between mb-6">
              <button (click)="prevMonth()" class="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <span class="text-lg font-bold text-slate-900">{{ calMonthName() }} {{ calYear() }}</span>
              <button (click)="nextMonth()" class="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">
                <svg class="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>

            <div class="grid grid-cols-7 gap-1 text-center mb-2">
              @for (d of ['Mo','Tu','We','Th','Fr','Sa','Su']; track d) {
                <div class="text-xs font-bold text-slate-400 py-1">{{ d }}</div>
              }
            </div>

            <div class="grid grid-cols-7 gap-1">
              @for (day of calDays(); track day.date) {
                <button (click)="selectDay(day)"
                  [disabled]="day.disabled"
                  class="h-10 rounded-xl text-sm font-semibold transition-all duration-150 relative"
                  [class]="day.selected
                    ? 'bg-purple-600 text-white shadow-md shadow-vibe-600/30'
                    : day.today
                      ? 'border-2 border-vibe-300 bg-vibe-100 text-vibe-700 hover:bg-vibe-200'
                      : day.disabled
                        ? 'text-slate-300 cursor-not-allowed'
                        : 'hover:bg-vibe-50 text-slate-700'">
                  {{ day.num }}
                  @if (day.today && !day.selected) {
                    <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibe-500"></span>
                  }
                </button>
              }
            </div>
          </div>

          <div>
            @if (selectedDate()) {
              <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 p-6 border border-slate-100 mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-sm font-bold text-slate-700">Available Time Slots</h3>
                  <span class="text-xs text-slate-400">{{ selectedDate() }}</span>
                </div>

                @if (loadingSlots()) {
                  <div class="grid grid-cols-2 gap-3">
                    @for (_ of [1,2,3,4]; track _) {
                      <div class="h-12 bg-slate-200 animate-pulse rounded-xl"></div>
                    }
                  </div>
                } @else if (slots().length > 0) {
                  <div class="grid grid-cols-2 gap-3">
                    @for (slot of slots(); track slot.id) {
                      <button (click)="selectedSlot.set(slot)"
                        [class]="'rounded-xl border-2 py-3 text-sm font-semibold transition-all duration-150 ' +
                          (selectedSlot()?.id === slot.id
                            ? 'border-vibe-500 bg-vibe-50 text-vibe-700 shadow-sm shadow-vibe-500/20'
                            : 'border-slate-200 hover:border-vibe-300 text-slate-700')">
                        {{ slot.startTime }}
                      </button>
                    }
                  </div>
                } @else {
                  <div class="text-center py-10 bg-slate-50 rounded-xl">
                    <p class="text-slate-400 font-medium">No available slots</p>
                    <p class="text-xs text-slate-300 mt-1">Try another date</p>
                  </div>
                }
              </div>
            }

            @if (auth.isAuthenticated()) {
                <button (click)="book()" [disabled]="!selectedSlot() || submitting()"
                  class="w-full rounded-xl bg-purple-600 py-4 font-bold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg">
                  @if (submitting()) {
                    <span class="inline-block animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 align-middle"></span>
                  }
                  {{ submitting() ? 'Booking...' : 'Confirm Booking' }}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreateBooking implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly auth = inject(AuthService);

  readonly service = signal<ServiceItem | null>(null);
  readonly slots = signal<TimeSlot[]>([]);
  readonly selectedSlot = signal<TimeSlot | null>(null);
  readonly loading = signal(false);
  readonly loadingSlots = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  serviceId = 0;

  readonly calViewDate = signal(new Date());
  readonly selectedDate = signal('');

  readonly todayStr = new Date().toISOString().split('T')[0];

  readonly calYear = computed(() => this.calViewDate().getFullYear());
  readonly calMonth = computed(() => this.calViewDate().getMonth());
  readonly calMonthName = computed(() =>
    ['January','February','March','April','May','June','July','August','September','October','November','December'][this.calMonth()]
  );

  readonly calDays = computed(() => {
    const year = this.calYear();
    const month = this.calMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    let offset = startDow - 1;
    if (offset < 0) offset = 6;
    const days: { num: number; date: string; disabled: boolean; today: boolean; selected: boolean }[] = [];
    const prevLast = new Date(year, month, 0);
    for (let i = offset - 1; i >= 0; i--) {
      days.push({ num: prevLast.getDate() - i, date: '', disabled: true, today: false, selected: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ num: d, date, disabled: date < this.todayStr, today: date === this.todayStr, selected: date === this.selectedDate() });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ num: d, date: '', disabled: true, today: false, selected: false });
    }
    return days;
  });

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('serviceId'));
    if (this.serviceId) {
      this.loadService();
      this.selectedDate.set(this.todayStr);
    }
  }

  private loadService(): void {
    this.loading.set(true);
    this.api.getService(this.serviceId).subscribe({
      next: (res) => {
        this.service.set(res.data);
        this.loading.set(false);
        this.loadSlots();
      },
      error: () => { this.error.set('Failed to load service'); this.loading.set(false); },
    });
  }

  selectDay(day: { date: string; disabled: boolean }): void {
    if (day.disabled || !day.date) return;
    this.selectedDate.set(day.date);
    this.loadSlots();
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

  loadSlots(): void {
    const date = this.selectedDate();
    if (!date) return;
    this.selectedSlot.set(null);
    this.loadingSlots.set(true);
    this.api.getAvailableSlots(this.serviceId, date).subscribe({
      next: (res) => {
        const svc = this.service();
        const duration = svc?.estimatedDuration;
        if (duration && duration > 0) {
          this.slots.set(this.generateSlotsFromRanges(res.data, duration, date));
        } else {
          this.slots.set([]);
        }
        this.loadingSlots.set(false);
      },
      error: () => this.loadingSlots.set(false),
    });
  }

  private generateSlotsFromRanges(ranges: TimeSlotRange[], durationMinutes: number, selectedDate: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let id = 0;
    const now = new Date();
    const isToday = selectedDate === this.todayStr;
    for (const range of ranges) {
      const start = new Date(range.startDateTime);
      const end = new Date(range.endDateTime);
      const slotMs = durationMinutes * 60 * 1000;
      let cur = start.getTime();
      while (cur + slotMs <= end.getTime()) {
        if (isToday && cur <= now.getTime()) {
          cur += slotMs;
          continue;
        }
        const slotStart = new Date(cur);
        slots.push({
          id: id++,
          startTime: `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`,
          endTime: `${String(new Date(cur + slotMs).getHours()).padStart(2, '0')}:${String(new Date(cur + slotMs).getMinutes()).padStart(2, '0')}`,
          isAvailable: true,
        });
        cur += slotMs;
      }
    }
    return slots;
  }

  book(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/booking/' + this.serviceId } });
      return;
    }
    const slot = this.selectedSlot();
    const date = this.selectedDate();
    if (!slot || !date) return;
    this.submitting.set(true);
    const startDateTime = `${date}T${slot.startTime}:00`;
    this.api.createBooking({ serviceId: this.serviceId, startDateTime }).subscribe({
      next: (res) => {
        if (res.isSuccess) { this.toast.success('Booking created successfully!'); this.router.navigate(['/customer/my-bookings']); }
        else { this.error.set(res.message); }
        this.submitting.set(false);
      },
      error: (err) => { this.error.set(err.error?.message || 'Booking failed'); this.submitting.set(false); },
    });
  }
}
