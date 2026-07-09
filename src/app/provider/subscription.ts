import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { SubscriptionPlan, Subscription } from '../core/models';

@Component({
  selector: 'app-provider-subscription',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div class="relative overflow-hidden bg-gradient-to-br from-vibe-50 via-purple-50 to-white text-slate-900">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">My Subscription</h1>
          <a class="mt-1.5 text-sm sm:text-base text-slate-300">Manage your current plan</a>
        </div>
      </div>

      <div class="mx-auto max-w-6xl px-6 -mt-6 pb-20">

        @if (loading()) {
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 animate-pulse space-y-4">
            <div class="h-6 bg-slate-200 rounded w-1/3"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2"></div>
            <div class="h-12 bg-slate-200 rounded w-24"></div>
          </div>
        } @else if (currentSub(); as cp) {
          <!-- Current Plan -->
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div class="px-6 sm:px-8 py-6 border-b border-slate-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-vibe-500 to-purple-600 flex items-center justify-center text-white text-xl shrink-0">⭐</div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Plan</p>
                    <h2 class="text-xl font-bold text-slate-900 mt-0.5">{{ cp.subscriptionTypeName || 'Plan' }}</h2>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Active
                </span>
              </div>
            </div>
            <div class="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Price Paid</p>
                <p class="mt-1.5 text-2xl font-bold text-vibe-600">\${{ cp.pricePaid || 0 }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Start Date</p>
                <p class="mt-1.5 text-base font-semibold text-slate-900">{{ cp.startDate | date:'mediumDate' }}</p>
              </div>
              <div class="rounded-xl bg-slate-50 p-4">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">End Date</p>
                <p class="mt-1.5 text-base font-semibold text-slate-900">{{ cp.endDate | date:'mediumDate' }}</p>
              </div>
            </div>
            <div class="px-6 sm:px-8 pb-6 sm:pb-8">
              <a routerLink="/subscription"
                class="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200">
                Change Your Plan
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </a>
            </div>
          </div>
        } @else if (valid() === false) {
          <!-- No subscription -->
          <div class="rounded-2xl bg-yellow-50 border border-yellow-200 p-6 mb-8 shadow-md">
            <div class="flex items-center gap-4">
              <span class="text-3xl">⚠️</span>
              <div class="flex-1">
                <p class="font-bold text-lg text-yellow-800">No active subscription</p>
                <p class="text-sm text-yellow-600">Select a plan below to get started</p>
              </div>
            </div>
          </div>
        }

        <!-- All Plans -->
        @if (plans().length > 0) {
          <h2 class="text-xl font-bold text-slate-900 mb-6">{{ valid() ? 'Available Plans' : 'Choose a Plan' }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (plan of plans(); track plan.id) {
              <div class="rounded-2xl bg-white shadow-sm border overflow-hidden transition-all duration-200"
                [class]="currentPlanId() === plan.id ? 'border-vibe-400 ring-2 ring-vibe-200' : 'border-slate-100 hover:shadow-md hover:-translate-y-0.5'">
                @if (plan.name.toLowerCase().includes('premium')) {
                  <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-center py-1.5 text-xs font-bold text-white">Most Popular</div>
                }
                @if (plan.name.toLowerCase().includes('enterprise')) {
                  <div class="bg-gradient-to-r from-vibe-500 to-vibe-700 text-center py-1.5 text-xs font-bold text-white">Best Value</div>
                }
                <div class="p-6 sm:p-8">
                  <div class="flex items-center justify-between gap-2">
                    <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
                    @if (currentPlanId() === plan.id) {
                      <span class="inline-flex items-center rounded-full bg-vibe-100 px-2.5 py-0.5 text-xs font-semibold text-vibe-700">Your current plan</span>
                    }
                  </div>
                  <p class="mt-1.5 text-sm text-slate-400 leading-relaxed min-h-[36px]">{{ plan.description }}</p>
                  <div class="mt-5 flex items-baseline gap-1">
                    <span class="text-4xl font-bold text-vibe-600">\${{ plan.price }}</span>
                    <span class="text-sm text-slate-400">/ {{ plan.durationDays }} days</span>
                  </div>
                  <ul class="mt-5 space-y-2.5">
                    <li class="flex items-center gap-2.5 text-sm text-slate-600"><span class="text-emerald-500">✓</span> Access to booking system</li>
                    <li class="flex items-center gap-2.5 text-sm text-slate-600"><span class="text-emerald-500">✓</span> Customer management</li>
                    <li class="flex items-center gap-2.5 text-sm text-slate-600"><span class="text-emerald-500">✓</span> Priority support</li>
                  </ul>
                  @if (currentPlanId() === plan.id) {
                    <div class="mt-6 w-full rounded-xl py-2.5 text-sm font-semibold text-center bg-slate-100 text-slate-400 cursor-not-allowed">Current Plan</div>
                  } @else {
                    <a [routerLink]="['/subscription/payment', plan.id]"
                      class="mt-6 w-full rounded-xl py-2.5 text-sm font-semibold transition-all inline-flex items-center justify-center bg-purple-600 text-white hover:bg-purple-700">
                      {{ valid() ? 'Switch to This Plan' : 'Subscribe' }}
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ProviderSubscription implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly valid = signal<boolean | null>(null);
  readonly currentSub = signal<Subscription | null>(null);
  readonly loading = signal(false);

  readonly currentPlanId = computed(() => this.currentSub()?.subscriptionTypeId ?? null);

  ngOnInit(): void { this.loadData(); }

  private loadData(): void {
    this.loading.set(true);
    this.api.getSubscriptionPlans().subscribe({ next: (res) => this.plans.set(res.data) });
    this.api.checkSubscriptionValidity().subscribe({
      next: (res) => {
        this.valid.set(res.data);
        if (res.data) this.loadCurrentSubscription();
        else this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private loadCurrentSubscription(): void {
    this.api.getAllSubscriptions().subscribe({
      next: (res) => {
        const userId = this.auth.user()?.id;
        const mine = res.data.filter((s) => s.serviceProviderId === userId);
        const latest = mine.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
        this.currentSub.set(latest || null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
