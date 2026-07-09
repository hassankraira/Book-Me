import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ServiceItem } from '../core/models';


@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-white">
      <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <a routerLink="/Categories" class="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors mb-6">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Categories
        </a>

        @if (loading()) {
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-pulse">
            <div class="lg:col-span-3 rounded-2xl bg-slate-100 h-80 shadow-lg shadow-slate-200/50 border border-slate-100"></div>
            <div class="lg:col-span-2 space-y-4">
              <div class="h-8 bg-slate-100 rounded w-3/4"></div>
              <div class="h-4 bg-slate-100 rounded w-1/3"></div>
              <div class="h-4 bg-slate-100 rounded w-full"></div>
              <div class="h-4 bg-slate-100 rounded w-2/3"></div>
              <div class="h-4 bg-slate-100 rounded w-5/6"></div>
              <div class="h-12 bg-slate-100 rounded-xl w-40 mt-6"></div>
            </div>
          </div>
        }

        @if (error()) {
          <div class="rounded-lg bg-red-50 border border-red-100 p-4 text-red-700 text-sm">{{ error() }}</div>
        }

        @if (service(); as svc) {
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div class="lg:col-span-3">
              @if (svc.imagePath) {
                <div class="rounded-2xl overflow-hidden bg-slate-100 shadow-lg shadow-slate-200/50 border border-slate-100">
                  <img [src]="svc.imagePath" class="w-full h-72 sm:h-96 object-cover" />
                </div>
              } @else {
                <div class="rounded-2xl h-64 bg-gradient-to-br from-vibe-50 to-purple-50 flex items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100">
                  <span class="text-7xl">🛠️</span>
                </div>
              }
            </div>

            <div class="lg:col-span-2">
              <div class="flex flex-wrap gap-1.5 mb-3">
                @if (svc.categoryName) { <span class="rounded-full bg-vibe-50 px-2.5 py-0.5 text-xs font-medium text-vibe-700">{{ svc.categoryName }}</span> }
                @if (svc.cityName) { <span class="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">{{ svc.cityName }}</span> }
              </div>

              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{{ svc.serviceName }}</h1>

              <div class="flex items-baseline gap-2 mt-3">
                <span class="text-3xl font-bold text-vibe-600">\${{ svc.price }}</span>
                <span class="text-sm text-slate-400">/ {{ svc.estimatedDuration }} min</span>
              </div>

              <div class="mt-6">
                <h2 class="text-sm font-semibold text-slate-900 mb-2">Description</h2>
                <p class="text-sm text-slate-500 leading-relaxed">{{ svc.description }}</p>
              </div>

              @if (svc.providerName) {
                <div class="mt-6 pt-6 border-t border-slate-100">
                  <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Provider</h2>
                  <div class="flex items-center gap-3">
                    <div class="h-9 w-9 rounded-full bg-gradient-to-br from-vibe-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {{ svc.providerName.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-semibold text-slate-900 text-sm">{{ svc.providerName }}</p>
                      <p class="text-xs text-slate-400">Service Provider</p>
                    </div>
                  </div>
                </div>
              }

              @if (auth.role() !== 'Admin') {
                <div class="mt-8">
                  <a [routerLink]="['/booking', svc.serviceId]"
                    class="inline-flex items-center justify-center w-full rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    Book This Service
                    <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </a>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ServiceDetail implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);

  readonly service = signal<ServiceItem | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadService(id);
  }

  private loadService(id: number): void {
    this.loading.set(true);
    this.api.getService(id).subscribe({
      next: (res) => { this.service.set(res.data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load service'); this.loading.set(false); },
    });
  }
}
