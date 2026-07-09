import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  template: `
    <section class="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4 py-16">
      <div class="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-vibe-200/20 blur-3xl"></div>
      <div class="absolute -bottom-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-200/15 blur-3xl"></div>
      <div class="absolute top-1/3 left-1/3 h-64 w-64 rounded-full bg-vibe-100/10 blur-3xl"></div>

      <div class="relative w-full max-w-5xl animate-fade-in-up">
        <div class="grid lg:grid-cols-2 rounded-[32px] bg-white/80 backdrop-blur-sm shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div class="hidden lg:flex flex-col justify-between bg-slate-50 border-r border-slate-100 p-10 sm:p-12 text-slate-900 relative overflow-hidden">
            <div class="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-vibe-200/20 blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-200/15 blur-3xl"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-10">
                <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-vibe-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M7 12L10 15L17 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <span class="text-xl font-bold tracking-tight">Book<span class="text-vibe-500">Me</span></span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.15]">Welcome Back!</h2>
              <p class="mt-4 text-base text-slate-500 leading-relaxed max-w-sm">Sign in to access your account, manage bookings, and connect with trusted professionals.</p>
            </div>
            <div class="relative z-10 flex items-center gap-2 text-sm text-slate-400">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-vibe-50 px-3 py-1 text-xs font-medium text-vibe-700">🔍 Browse</span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-vibe-50 px-3 py-1 text-xs font-medium text-vibe-700">📅 Book</span>
              <span class="inline-flex items-center gap-1.5 rounded-full bg-vibe-50 px-3 py-1 text-xs font-medium text-vibe-700">⭐ Reviews</span>
            </div>
          </div>

          <div class="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div class="lg:hidden flex items-center gap-3 mb-8">
              <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-vibe-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"><path d="M7 12L10 15L17 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="text-lg font-bold tracking-tight text-slate-900">BookMe</span>
            </div>

            <div class="animate-fade-in-up stagger-1">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Sign In</h1>
              <p class="mt-2 text-sm text-slate-400">Enter your credentials to access your account</p>
            </div>

            @if (error()) {
              <div class="mt-6 rounded-xl bg-rose-50/80 backdrop-blur-sm border border-rose-100 p-3.5 text-sm text-rose-700 flex items-center gap-2.5 animate-fade-in">
                <span class="text-base shrink-0">✕</span>
                <span>{{ error() }}</span>
              </div>
            }

            <form (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
              <div class="animate-fade-in-up stagger-2">
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div class="relative">
                  <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <input #emailRef="ngModel" type="email" [(ngModel)]="email" name="email" required
                    class="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 focus:bg-white placeholder:text-slate-400"
                    placeholder="you@example.com"
                    [class.input-error]="emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())" />
                </div>
                @if (emailRef.invalid && (emailRef.dirty || emailRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    @if (emailRef.errors?.['required']) { Email is required }
                    @if (emailRef.errors?.['email']) { Enter a valid email }
                  </div>
                }
              </div>

              <div class="animate-fade-in-up stagger-3">
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div class="relative">
                  <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <input #passwordRef="ngModel" type="password" [(ngModel)]="password" name="password" required autocomplete="current-password"
                    class="w-full rounded-xl border border-slate-200 bg-white/80 pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 focus:bg-white placeholder:text-slate-400"
                    placeholder="••••••••"
                    [class.input-error]="passwordRef.invalid && (passwordRef.dirty || passwordRef.touched || submitted())" />
                </div>
                @if (passwordRef.invalid && (passwordRef.dirty || passwordRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Password is required
                  </div>
                }
              </div>

              <div class="animate-fade-in-up stagger-4">
                <button type="submit" [disabled]="loading()"
                  class="group relative w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-vibe-500/25 hover:shadow-xl hover:shadow-vibe-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 overflow-hidden">
                  <span class="absolute inset-0 bg-gradient-to-r from-vibe-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  @if (loading()) {
                    <span class="relative z-10 inline-flex items-center gap-2">
                      <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Signing in...
                    </span>
                  } @else {
                    <span class="relative z-10 inline-flex items-center gap-2">
                      Sign In
                      <svg class="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </span>
                  }
                </button>
              </div>
            </form>

            <div class="mt-8 text-center animate-fade-in-up stagger-5">
              <p class="text-sm text-slate-400">
                Don't have an account?
                <a routerLink="/auth/register" class="font-semibold text-vibe-600 hover:text-vibe-700 transition-colors">Create one</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class Login {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal(false);

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set(null);

    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data?.token) {
          const user = data?.user ?? {};
          this.auth.saveAuth(data.token, user);
          this.toast.success('Welcome back!');
          this.api.getProfile().subscribe({
            next: (profileRes) => { if (profileRes.isSuccess) this.auth.updateUser(profileRes.data); },
          });
          const returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            const role = this.auth.role();
            if (role === 'Admin') this.router.navigate(['/admin/dashboard']);
            else if (role === 'ServiceProvider') this.router.navigate(['/dashboard']);
            else this.router.navigate(['/profile']);
          }
        } else {
          this.error.set(res?.message || data?.message || 'Login failed');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Invalid email or password');
        this.loading.set(false);
      },
    });
  }
}
