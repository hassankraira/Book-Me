import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-16">
      <div class="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-vibe-200/20 blur-3xl"></div>
      <div class="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-200/15 blur-3xl"></div>

      <div class="relative w-full max-w-lg animate-fade-in-up">
        <div class="text-center mb-8">
          <div class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-vibe-500 via-purple-500 to-pink-500 shadow-lg shadow-vibe-500/25 mb-4">
            <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M7 12L10 15L17 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p class="mt-2 text-sm text-slate-400">Fill in the details to get started</p>
        </div>

        @if (error()) {
          <div class="mb-6 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-sm text-rose-700 flex items-center gap-2.5 animate-fade-in">
            <span class="text-base shrink-0">✕</span>
            <span>{{ error() }}</span>
          </div>
        }
        @if (success()) {
          <div class="mb-6 rounded-xl bg-green-50 border border-green-200 p-3.5 text-sm text-green-700 flex items-center gap-2.5 animate-fade-in">
            <span class="text-base shrink-0">✓</span>
            <span>{{ success() }}</span>
          </div>
        }

        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input #firstNameRef="ngModel" type="text" [(ngModel)]="firstName" name="firstName" required autocomplete="given-name"
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                  placeholder="John"
                  [class.input-error]="firstNameRef.invalid && (firstNameRef.dirty || firstNameRef.touched || submitted())" />
                @if (firstNameRef.invalid && (firstNameRef.dirty || firstNameRef.touched || submitted())) {
                  <div class="field-error">First name is required</div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input #lastNameRef="ngModel" type="text" [(ngModel)]="lastName" name="lastName" required autocomplete="family-name"
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                  placeholder="Doe"
                  [class.input-error]="lastNameRef.invalid && (lastNameRef.dirty || lastNameRef.touched || submitted())" />
                @if (lastNameRef.invalid && (lastNameRef.dirty || lastNameRef.touched || submitted())) {
                  <div class="field-error">Last name is required</div>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input #emailRef="ngModel" type="email" [(ngModel)]="email" name="email" required autocomplete="email"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                placeholder="you@example.com"
                [class.input-error]="emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())" />
              @if (emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())) {
                <div class="field-error">
                  @if (emailRef.errors?.['required']) { Email is required }
                  @if (emailRef.errors?.['email']) { Enter a valid email }
                </div>
              }
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input #phoneRef="ngModel" type="tel" [(ngModel)]="phoneNumber" name="phoneNumber" required autocomplete="tel"
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                  placeholder="+1234567890"
                  [class.input-error]="phoneRef.invalid && (phoneRef.dirty || phoneRef.touched || submitted())" />
                @if (phoneRef.invalid && (phoneRef.dirty || phoneRef.touched || submitted())) {
                  <div class="field-error">Phone number is required</div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input #addressRef="ngModel" type="text" [(ngModel)]="address" name="address" required autocomplete="street-address"
                  class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                  placeholder="Your address"
                  [class.input-error]="addressRef.invalid && (addressRef.dirty || addressRef.touched || submitted())" />
                @if (addressRef.invalid && (addressRef.dirty || addressRef.touched || submitted())) {
                  <div class="field-error">Address is required</div>
                }
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input #passwordRef="ngModel" type="password" [(ngModel)]="password" name="password" required minlength="6" autocomplete="new-password"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                placeholder="Min 6 characters"
                [class.input-error]="(passwordRef.invalid && (passwordRef.dirty || passwordRef.touched || submitted())) || (submitted() && password && confirmPassword && password !== confirmPassword)" />
              @if (passwordRef.invalid && (passwordRef.dirty || passwordRef.touched || submitted())) {
                <div class="field-error">
                  @if (passwordRef.errors?.['required']) { Password is required }
                  @if (passwordRef.errors?.['minlength']) { At least 6 characters }
                </div>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input #confirmRef="ngModel" type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required autocomplete="new-password"
                class="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400"
                [class.input-error]="(confirmRef.invalid && (confirmRef.dirty || confirmRef.touched || submitted())) || (submitted() && password && confirmPassword && password !== confirmPassword)" />
              @if (confirmRef.invalid && (confirmRef.dirty || confirmRef.touched || submitted())) {
                <div class="field-error">Please confirm your password</div>
              }
              @if (submitted() && password && confirmPassword && password !== confirmPassword) {
                <div class="field-error">Passwords do not match</div>
              }
            </div>

            <div class="rounded-lg bg-vibe-50 border border-vibe-100 p-3.5 flex items-start gap-3">
              <span class="text-base shrink-0">🙋</span>
              <p class="text-xs text-slate-600">You're joining as a <span class="font-semibold text-vibe-700">Customer</span>. You can upgrade to a Provider later.</p>
            </div>

            <button type="submit" [disabled]="loading()"
              class="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-purple-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              @if (loading()) {
                <span class="inline-flex items-center gap-2">
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Creating account...
                </span>
              } @else {
                Create Account
              }
            </button>
          </form>
        </div>

        <p class="mt-6 text-center text-sm text-slate-400">
          Already have an account?
          <a routerLink="/auth/login" class="font-semibold text-vibe-600 hover:text-vibe-700 transition-colors">Sign in</a>
        </p>
      </div>
    </section>
  `,
})
export class Register {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  phoneNumber = '';
  address = '';
  password = '';
  confirmPassword = '';

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly success = signal<string | null>(null);
  readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.phoneNumber || !this.address) return;
    if (this.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword,
        phoneNumber: this.phoneNumber,
        address: this.address,
      })
      .subscribe({
        next: (res: any) => {
          const data = res?.data ?? res;
          if (data?.token) {
            const user = data?.user ?? {};
            this.auth.saveAuth(data.token, user);
            this.toast.success('Account created successfully!');
            this.api.getProfile().subscribe({
              next: (profileRes) => { if (profileRes.isSuccess) this.auth.updateUser(profileRes.data); },
            });
            this.router.navigate(['/customer/services']);
          } else if (res?.message) {
            this.success.set(res.message);
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          } else {
            this.success.set('Account created successfully!');
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          }
          this.loading.set(false);
        },
        error: (err) => {
          const apiErr = err.error;
          if (apiErr && typeof apiErr.errors === 'object' && !Array.isArray(apiErr.errors)) {
            const messages: string[] = [];
            for (const key in apiErr.errors) {
              if (Array.isArray(apiErr.errors[key])) {
                messages.push(...apiErr.errors[key]);
              }
            }
            this.error.set(messages.length ? messages.join('. ') : 'Please check your inputs.');
          } else if (typeof apiErr === 'string') {
            this.error.set(apiErr);
          } else if (apiErr?.message) {
            this.error.set(apiErr.message);
          } else if (err.status === 400) {
            this.error.set('Please fix the highlighted fields and try again.');
          } else {
            this.error.set(`Server error (${err.status || 'network'}). Please try again later.`);
          }
          this.loading.set(false);
        },
      });
  }
}
