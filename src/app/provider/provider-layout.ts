import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-provider-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex min-h-screen bg-slate-50">
      <aside class="hidden lg:flex flex-col w-60 h-full pt-16 z-30">
        <div class="px-4 pt-6 pb-4 border-b border-slate-100">
          <p class="text-xs text-slate-400 uppercase tracking-wider font-semibold">Menu</p>
        </div>
        <nav class="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            [routerLinkActiveOptions]="{exact:true}"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-vibe-700 font-semibold border-r-2 border-vibe-500">
            <span class="text-base">📊</span> Dashboard
          </a>
          <a routerLink="/dashboard/bookings" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <span class="text-base">📅</span> Incoming Bookings
          </a>
          <a routerLink="/dashboard/services" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <span class="text-base">🛠️</span> My Services
          </a>
          <a routerLink="/dashboard/Add_service" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <span class="text-base">➕</span> Add Service
          </a>
          <a routerLink="/dashboard/subscription" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <span class="text-base">⭐</span> Subscription
          </a>
          <a routerLink="/dashboard/profile" routerLinkActive="-50 text-vibe-700 font-semibold border-r-2 border-vibe-500"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <span class="text-base">👤</span> My Profile
          </a>
        </nav>
        <div class="p-4 border-t border-slate-100">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="h-8 w-8 rounded-full bg-gradient-to-br from-vibe-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{{ auth.userName().charAt(0) }}</div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ auth.userName() }}</p>
              <p class="text-xs text-slate-400">Provider</p>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-h-screen pt-16">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ProviderLayout {
  protected readonly auth = inject(AuthService);
}
