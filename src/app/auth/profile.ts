import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div class="relative overflow-hidden bg-gradient-to-br from-vibe-50 via-purple-50 to-white text-slate-900">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">My Profile</h1>
          <a class="mt-1 text-sm text-slate-300">Manage your personal information</a>
        </div>
      </div>

      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-6 pb-20">
        <div class="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 sm:px-8 py-6 sm:py-8 border-b border-slate-100">
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
              <div class="relative group cursor-pointer shrink-0" (click)="fileInput.click()">
                @if (photoPreview()) {
                  <img [src]="photoPreview()" class="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover shadow-sm ring-2 ring-slate-100" />
                } @else {
                  <div class="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-vibe-500 to-vibe-700 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-sm ring-2 ring-slate-100">
                    {{ form.firstName.charAt(0) }}{{ form.lastName.charAt(0) }}
                  </div>
                }
                <div class="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <div class="text-center sm:text-left">
                <h2 class="text-xl sm:text-2xl font-bold text-slate-900">{{ form.firstName }} {{ form.lastName }}</h2>
                <p class="text-sm text-slate-400">{{ form.email }}</p>
                <span class="inline-flex items-center mt-1.5 rounded-full bg-vibe-50 px-2.5 py-0.5 text-xs font-medium text-vibe-600">{{ form.role }}</span>
                <div class="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                  @if (form.role === 'ServiceProvider') {
                    <a routerLink="/dashboard" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">Dashboard</a>
                    <a routerLink="/dashboard/services" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">My Services</a>
                  }
                  @if (form.role === 'User') {
                    <a routerLink="/customer/services" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">Browse Services</a>
                    <a routerLink="/customer/my-bookings" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">My Bookings</a>
                    <a routerLink="/subscription" class="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">Become a Provider</a>
                  }
                  @if (form.role === 'ServiceProvider') {
                    <a routerLink="/customer/my-bookings" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">My Bookings</a>
                  }
                  @if (form.role === 'Admin') {
                    <a routerLink="/admin/dashboard" class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors">Dashboard</a>
                  }
                </div>
              </div>
            </div>
            <input #fileInput type="file" accept="image/*" class="hidden" (change)="onPhotoChange($event)" />
          </div>

          @if (loading()) {
            <div class="p-6 sm:p-8 animate-pulse space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2"><div class="h-3 bg-slate-200 rounded w-16"></div><div class="h-10 bg-slate-200 rounded-lg"></div></div>
                <div class="space-y-2"><div class="h-3 bg-slate-200 rounded w-16"></div><div class="h-10 bg-slate-200 rounded-lg"></div></div>
              </div>
              <div class="space-y-2"><div class="h-3 bg-slate-200 rounded w-14"></div><div class="h-10 bg-slate-200 rounded-lg"></div></div>
              <div class="space-y-2"><div class="h-3 bg-slate-200 rounded w-20"></div><div class="h-10 bg-slate-200 rounded-lg"></div></div>
              <div class="h-10 bg-slate-200 rounded-lg"></div>
            </div>
          }

          @if (error()) {
            <div class="mx-6 sm:mx-8 mt-6 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">{{ error() }}</div>
          }

          <form (ngSubmit)="onSubmit()" class="p-6 sm:p-8 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input #fnRef="ngModel" type="text" [(ngModel)]="form.firstName" name="firstName" required
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                  [class.input-error]="fnRef.invalid && (fnRef.dirty || fnRef.touched || submitted())" />
                @if (fnRef.invalid && (fnRef.dirty || fnRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    First name is required
                  </div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input #lnRef="ngModel" type="text" [(ngModel)]="form.lastName" name="lastName" required
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                  [class.input-error]="lnRef.invalid && (lnRef.dirty || lnRef.touched || submitted())" />
                @if (lnRef.invalid && (lnRef.dirty || lnRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Last name is required
                  </div>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" [value]="form.email" disabled
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="text" [(ngModel)]="form.phoneNumber" name="phoneNumber"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15" />
            </div>

            <button type="submit" [disabled]="submitting()"
              class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 disabled:opacity-60 transition-all">
              @if (submitting()) {
                <span class="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2 align-middle"></span>
              }
              {{ submitting() ? 'Saving...' : 'Update Profile' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class Profile implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly photoPreview = signal<string | null>(null);
  readonly submitted = signal(false);

  form = { firstName: '', lastName: '', email: '', phoneNumber: '', role: '', cityId: 0 };
  private pendingPhotoFile: File | null = null;

  ngOnInit(): void { this.loadProfile(); }

  private loadProfile(): void {
    this.loading.set(true);
    this.api.getProfile().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          const u = res.data;
          this.form = { firstName: u.firstName, lastName: u.lastName, email: u.email, phoneNumber: u.phoneNumber ?? '', role: u.role, cityId: u.cityId ?? 0 };
          this.auth.updateUser(u);
          const saved = localStorage.getItem('bookme_avatar_' + u.id);
          if (u.imagePath && u.imagePath.length > 0) {
            this.photoPreview.set(u.imagePath.startsWith('http') ? u.imagePath : 'https://aboodhassan-001-site1.jtempurl.com/' + u.imagePath.replace(/^\//, ''));
          } else if (saved) {
            this.photoPreview.set(saved);
          }
        }
        this.loading.set(false);
      },
      error: () => { this.error.set('Failed to load profile'); this.loading.set(false); },
    });
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.pendingPhotoFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.form.firstName || !this.form.lastName) return;
    this.submitting.set(true);
    this.error.set(null);

    const payload: any = { firstName: this.form.firstName, lastName: this.form.lastName, phoneNumber: this.form.phoneNumber, imagePath: this.pendingPhotoFile };

    this.api.updateProfile(payload).subscribe({
      next: (res) => {
        const current = this.auth.user();
        if (current) {
          this.auth.updateUser({ ...current, firstName: this.form.firstName, lastName: this.form.lastName, phoneNumber: this.form.phoneNumber });
        }
        this.toast.success(res.isSuccess ? 'Profile updated' : 'Profile saved locally');
        this.submitting.set(false);
        this.loadProfile();
      },
      error: () => {
        const current = this.auth.user();
        if (current) {
          this.auth.updateUser({ ...current, firstName: this.form.firstName, lastName: this.form.lastName, phoneNumber: this.form.phoneNumber });
        }
        this.toast.success('Profile saved locally');
        this.submitting.set(false);
      },
    });
  }
}
