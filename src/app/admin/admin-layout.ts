import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex bg-slate-50">
      <aside class="hidden lg:flex lg:flex-col w-64 shrink-0 bg-white border-r border-slate-200 shadow-sm">
        <nav class="flex-1 px-3 pt-6 space-y-1 overflow-y-auto">
          @for (item of navItems; track item.route) {
            <a [routerLink]="[item.route]"
               routerLinkActive="bg-vibe-50 text-vibe-700 border-r-2 border-vibe-600"
               #rla="routerLinkActive"
               class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group"
               [class.text-slate-600]="!rla.isActive"
               [class.hover:bg-slate-50]="!rla.isActive"
               [class.hover:text-slate-900]="!rla.isActive"
               [title]="item.label">
              <span class="text-lg shrink-0" [class.opacity-70]="!rla.isActive">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
      </aside>

      <main class="flex-1 min-h-screen">
        <div class="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
          <button (click)="toggleMobileMenu()" class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div class="flex items-center gap-2">
            <a routerLink="/Home"
              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
              Back to Site
            </a>
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              {{ auth.userName() || 'Admin' }}
            </div>
          </div>
        </div>

        <div class="hidden lg:flex items-center justify-end gap-3 px-6 py-4 border-b border-slate-100 bg-white">
          <a routerLink="/Home"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Site
          </a>
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-xs font-semibold text-slate-600">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            {{ auth.userName() || 'Admin' }}
          </div>
        </div>

        <router-outlet />

        @if (mobileMenuOpen()) {
          <div class="fixed inset-0 z-50 lg:hidden">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" (click)="closeMobileMenu()"></div>
            <aside class="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl border-r border-slate-200 overflow-y-auto">
              <div class="flex items-center justify-end px-5 py-4 border-b border-slate-100">
                <button (click)="closeMobileMenu()" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <nav class="px-3 pt-4 space-y-1">
                @for (item of navItems; track item.route) {
                  <a [routerLink]="[item.route]" (click)="closeMobileMenu()"
                     routerLinkActive="bg-vibe-50 text-vibe-700 font-semibold"
                     #rla="routerLinkActive"
                     class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                     [class.text-slate-600]="!rla.isActive"
                     [class.hover:bg-slate-50]="!rla.isActive">
                    <span class="text-lg">{{ item.icon }}</span>
                    <span>{{ item.label }}</span>
                  </a>
                }
                <div class="pt-4 mt-4 border-t border-slate-100">
                  <a routerLink="/Home" (click)="closeMobileMenu()"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Back to Site
                  </a>
                </div>
              </nav>
            </aside>
          </div>
        }
      </main>
    </div>
  `,
})
export class AdminLayout {
  protected readonly auth = inject(AuthService);

  readonly mobileMenuOpen = signal(false);

  readonly navItems = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: '⚙' },
    { label: 'Users', route: '/admin/users', icon: '👥' },
    { label: 'Services', route: '/admin/services', icon: '🛠️' },
    { label: 'Categories', route: '/admin/categories', icon: '📂' },
    { label: 'Cities', route: '/admin/cities', icon: '🏙️' },
    { label: 'Plans', route: '/admin/plans', icon: '⭐' },
    { label: 'Subscriptions', route: '/admin/subscriptions', icon: '📋' },
    { label: 'Payments', route: '/admin/payments', icon: '💳' },
  ];

  toggleMobileMenu(): void { this.mobileMenuOpen.update((v) => !v); }
  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }
}
