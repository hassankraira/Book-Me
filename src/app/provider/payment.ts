import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { SubscriptionPlan } from '../core/models';

@Component({
  selector: 'app-payment',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-16">
      <div class="w-full max-w-lg">
        <a routerLink="/subscription" class="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Plans
        </a>

        @if (loading()) {
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 animate-pulse space-y-4">
            <div class="h-6 bg-slate-200 rounded w-2/3"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2"></div>
            <div class="h-12 bg-slate-200 rounded w-1/3"></div>
            <div class="h-12 bg-slate-200 rounded-xl w-full"></div>
          </div>
        } @else if (error()) {
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 text-center">
            <div class="text-5xl mb-4">⚠️</div>
            <h2 class="text-xl font-bold text-slate-900">Plan not found</h2>
            <p class="mt-2 text-sm text-slate-400">{{ error() }}</p>
            <a routerLink="/subscription" class="mt-6 inline-flex rounded-xl bg-vibe-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 transition-all">Browse Plans</a>
          </div>
        } @else if (plan(); as p) {
          <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-vibe-500 to-purple-600 px-8 py-6">
              <h1 class="text-2xl font-bold text-white">Complete Payment</h1>
              <p class="text-sm text-white/80 mt-1">Activate your {{ p.name }} plan</p>
            </div>

            <div class="p-8 space-y-6">
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <span class="text-sm text-slate-500">Plan</span>
                <span class="text-base font-bold text-slate-900">{{ p.name }}</span>
              </div>
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <span class="text-sm text-slate-500">Duration</span>
                <span class="text-base font-bold text-slate-900">{{ p.durationDays }} days</span>
              </div>
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <span class="text-sm text-slate-500">Amount</span>
                <span class="text-2xl font-bold text-vibe-600">\${{ p.price }}</span>
              </div>
              <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                <span class="text-sm text-slate-500">Payment Method</span>
                <span class="text-base font-semibold text-slate-900">Cash / Bank Transfer</span>
              </div>

              <button (click)="confirmPayment()" [disabled]="submitting()"
                class="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                @if (submitting()) {
                  <span class="inline-flex items-center gap-2">
                    <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-2">
                    Pay \${{ p.price }} & Activate
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </span>
                }
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class Payment implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly plan = signal<SubscriptionPlan | null>(null);
  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  private planId = 0;

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('planId')) || 0;
    if (!this.planId) { this.error.set('Invalid plan'); return; }
    this.loadPlan();
  }

  private loadPlan(): void {
    this.loading.set(true);
    this.api.getSubscriptionPlans().subscribe({
      next: (res) => {
        const found = res.data.find((p) => p.id === this.planId);
        if (found) this.plan.set(found);
        else this.error.set('Plan not found');
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load plan'); this.loading.set(false); },
    });
  }

  confirmPayment(): void {
    this.submitting.set(true);
    this.api.createOrUpgradeSubscription(this.planId, 0).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.toast.success('Subscription activated! Please sign in again.');
          this.auth.logout();
        } else {
          this.toast.error(res.message || 'Payment failed');
          this.submitting.set(false);
        }
      },
      error: () => { this.toast.error('Payment failed'); this.submitting.set(false); },
    });
  }
}
