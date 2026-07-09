import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { SubscriptionPlan } from '../core/models';

@Component({
  selector: 'app-admin-subscription-plans',
  imports: [FormsModule],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <div class="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-xl shrink-0">⭐</div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Plans</h1>
          <p class="text-sm text-slate-400 mt-0.5">Create and manage subscription tiers for providers</p>
        </div>
      </div>
        <div class="rounded-lg bg-white shadow-sm border border-slate-100 p-5 mb-6">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ editId ? 'Edit Plan' : 'New Plan' }}</h2>
          <form (ngSubmit)="onSubmit()" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <input #nameRef="ngModel" type="text" [(ngModel)]="form.name" name="name" placeholder="Plan name" required
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                [class.input-error]="nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())" />
              @if (nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Plan name is required
                  </div>
              }
            </div>
            <div class="sm:col-span-2">
              <input type="text" [(ngModel)]="form.description" name="description" placeholder="Short description"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15" />
            </div>
            <div>
              <input #priceRef="ngModel" type="number" [(ngModel)]="form.price" name="price" placeholder="Price" required min="0" step="0.01"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                [class.input-error]="priceRef.invalid && (priceRef.dirty || priceRef.touched || submitted())" />
              @if (priceRef.invalid && (priceRef.dirty || priceRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Price is required
                  </div>
              }
            </div>
            <div>
              <input #durRef="ngModel" type="number" [(ngModel)]="form.durationDays" name="durationDays" placeholder="Duration (days)" required min="1"
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                [class.input-error]="durRef.invalid && (durRef.dirty || durRef.touched || submitted())" />
              @if (durRef.invalid && (durRef.dirty || durRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Duration is required
                  </div>
              }
            </div>
            <div class="sm:col-span-2 flex gap-2">
              <button type="submit" class="rounded-lg bg-vibe-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 transition-all">{{ editId ? 'Update' : 'Create' }}</button>
              @if (editId) { <button type="button" (click)="resetForm()" class="rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button> }
            </div>
          </form>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            @for (_ of [1,2,3]; track _) {
              <div class="rounded-lg bg-white shadow-sm border border-slate-100 p-5 space-y-4">
                <div class="h-5 bg-slate-200 rounded w-2/3"></div>
                <div class="h-4 bg-slate-200 rounded w-full"></div>
                <div class="h-7 bg-slate-200 rounded w-24"></div>
                <div class="flex gap-2">
                  <div class="flex-1 h-9 bg-slate-200 rounded-lg"></div>
                  <div class="flex-1 h-9 bg-slate-200 rounded-lg"></div>
                </div>
              </div>
            }
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (p of plans(); track p.id) {
            <div class="rounded-lg bg-white shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all">
              <h3 class="text-lg font-bold text-slate-900">{{ p.name }}</h3>
              <p class="mt-1.5 text-sm text-slate-400">{{ p.description }}</p>
              <div class="mt-4 flex items-baseline gap-1">
                <span class="text-2xl font-bold text-vibe-600">\${{ p.price }}</span>
                <span class="text-sm text-slate-400">/ {{ p.durationDays }} days</span>
              </div>
              <div class="mt-5 flex gap-2">
                <button (click)="edit(p)" class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">Edit</button>
                <button (click)="deletePlan(p.id)" class="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
              </div>
            </div>
          } @empty {
            @if (!loading()) { <p class="col-span-full text-center text-slate-400 py-16">No plans</p> }
          }
      </div>
    </div>
  `,
})
export class AdminSubscriptionPlans implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly plans = signal<SubscriptionPlan[]>([]);
  readonly loading = signal(false);
  readonly submitted = signal(false);
  form = { name: '', description: '', price: 0, durationDays: 30 };
  editId = 0;

  ngOnInit(): void { this.loadPlans(); }

  private loadPlans(): void {
    this.loading.set(true);
    this.api.getSubscriptionPlans().subscribe({
      next: (res) => { this.plans.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  resetForm(): void { this.form = { name: '', description: '', price: 0, durationDays: 30 }; this.editId = 0; }

  edit(p: SubscriptionPlan): void { this.editId = p.id; this.form = { name: p.name, description: p.description, price: p.price, durationDays: p.durationDays }; }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.form.name.trim() || !this.form.price || !this.form.durationDays) return;
    if (this.editId) {
      this.api.updateSubscriptionPlan(this.editId, this.form).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('Plan updated'); this.resetForm(); this.loadPlans(); } },
        error: () => this.toast.error('Update failed'),
      });
    } else {
      this.api.createSubscriptionPlan(this.form).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('Plan created'); this.resetForm(); this.loadPlans(); } },
        error: () => this.toast.error('Create failed'),
      });
    }
  }

  deletePlan(id: number): void {
    if (!confirm('Delete this plan?')) return;
    this.api.deleteSubscriptionPlan(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('Plan deleted'); this.loadPlans(); } },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
