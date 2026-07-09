import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { ServiceItem, Category, City } from '../core/models';

@Component({
  selector: 'app-services-list',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div class="relative overflow-hidden bg-gradient-to-br from-vibe-50 via-purple-50 to-white text-slate-900">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">Browse Services</h1>
          <p class="mt-1.5 text-sm sm:text-base text-slate-300">Find the perfect professional for your needs</p>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-6 -mt-6 pb-20">
        <div class="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/50 mb-8 border border-slate-100">
          <div class="flex flex-wrap items-end gap-4">
            <div class="flex-1 min-w-[200px]">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Search</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input type="text" [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Search services..."
                  class="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20" />
              </div>
            </div>
            <div class="min-w-[200px]">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
              <div class="relative">
                @if (selectedCategory) {
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-full bg-vibe-100 px-2.5 py-0.5 text-xs font-semibold text-vibe-700">
                    {{ getCategoryName(selectedCategory) }}
                    <button (click)="selectedCategory=''; applyFilters()" class="ml-0.5 hover:text-vibe-900">&times;</button>
                  </div>
                }
                <select [(ngModel)]="selectedCategory" (change)="applyFilters()"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20 bg-white"
                  [class.pl-28]="selectedCategory">
                  <option value="">All Categories</option>
                  @for (cat of categories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
                </select>
              </div>
            </div>
            <div class="min-w-[200px]">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">City</label>
              <div class="relative">
                @if (selectedCity) {
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {{ getCityName(selectedCity) }}
                    <button (click)="selectedCity=''; applyFilters()" class="ml-0.5 hover:text-emerald-900">&times;</button>
                  </div>
                }
                <select [(ngModel)]="selectedCity" (change)="applyFilters()"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20 bg-white"
                  [class.pl-28]="selectedCity">
                  <option value="">All Cities</option>
                  @for (c of cities(); track c.cityId) { <option [value]="c.cityId">{{ c.cityName }}</option> }
                </select>
              </div>
            </div>
            <div class="flex items-end gap-2 pb-1">
              @if (selectedCategory || selectedCity || searchTerm) {
                <button (click)="clearFilters()" class="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  Clear
                </button>
              }
            </div>
          </div>
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            @for (_ of [1,2,3,4,5,6]; track _) {
              <div class="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
                <div class="h-48 bg-slate-200"></div>
                <div class="p-6 space-y-3">
                  <div class="h-5 bg-slate-200 rounded w-3/4"></div>
                  <div class="h-3 bg-slate-200 rounded w-full"></div>
                  <div class="h-3 bg-slate-200 rounded w-2/3"></div>
                  <div class="flex gap-2 mt-2">
                    <div class="h-6 bg-slate-200 rounded-full w-20"></div>
                    <div class="h-6 bg-slate-200 rounded-full w-16"></div>
                  </div>
                  <div class="h-10 bg-slate-200 rounded-xl mt-4"></div>
                </div>
              </div>
            }
          </div>
        }

        @if (error()) {
          <div class="rounded-xl bg-red-50 border border-red-100 p-4 text-red-700 mb-6">{{ error() }}</div>
        }

        @if (!loading() && services().length > 0) {
          <p class="text-sm text-slate-500 mb-4">{{ services().length }} service{{ services().length !== 1 ? 's' : '' }} found</p>
        }

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (svc of services(); track svc.serviceId) {
            <div class="group rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100">
              @if (svc.imagePath) {
                <div class="h-48 overflow-hidden">
                  <img [src]="svc.imagePath" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              } @else {
                <div class="h-48 bg-gradient-to-br from-vibe-100 to-purple-100 flex items-center justify-center">
                  <span class="text-5xl">🛠️</span>
                </div>
              }
              <div class="p-6">
                <h3 class="text-xl font-bold text-slate-900 group-hover:text-vibe-700 transition-colors">{{ svc.serviceName }}</h3>
                <p class="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{{ svc.description }}</p>
                <div class="mt-4 flex flex-wrap gap-2">
                  @if (svc.categoryName) { <span class="rounded-full bg-vibe-50 px-3 py-1 text-xs font-medium text-vibe-700">{{ svc.categoryName }}</span> }
                  @if (svc.cityName) { <span class="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{{ svc.cityName }}</span> }
                </div>
                <div class="mt-5 flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span class="text-2xl font-bold text-vibe-600">\${{ svc.price }}</span>
                    <span class="text-sm text-slate-400 ml-2">/ {{ svc.estimatedDuration }} min</span>
                  </div>
                  <a [routerLink]="['/customer/services', svc.serviceId]"
                    class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-vibe-700 transition-all active:scale-[0.97]">
                    Book Now
                  </a>
                </div>
              </div>
            </div>
          } @empty {
            @if (!loading()) {
              <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <p class="text-xl text-slate-400 font-medium">No services found</p>
                <p class="text-slate-400 mt-1">Try adjusting your filters or search term</p>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class ServicesList implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly services = signal<ServiceItem[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly cities = signal<City[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  searchTerm = '';
  selectedCategory: number | string = '';
  selectedCity: number | string = '';
  private searchTimeout: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['category']) this.selectedCategory = Number(params['category']);
      this.loadServices();
    });
    this.loadCategories();
    this.loadCities();
  }

  private loadServices(): void {
    this.loading.set(true);
    this.api.getAllActiveServices().subscribe({
      next: (res) => { this.services.set(res.data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load services'); this.loading.set(false); },
    });
  }

  private loadCategories(): void { this.api.getCategories().subscribe({ next: (res) => this.categories.set(res.data) }); }
  private loadCities(): void { this.api.getCities().subscribe({ next: (res) => this.cities.set(res.data) }); }

  getCategoryName(id: number | string): string {
    return this.categories().find((c) => c.id === Number(id))?.name ?? 'Category';
  }

  getCityName(id: number | string): string {
    return this.cities().find((c) => c.cityId === Number(id))?.cityName ?? 'City';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedCity = '';
    this.applyFilters();
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.applyFilters(), 400);
  }

  applyFilters(): void {
    this.loading.set(true);
    const catId = Number(this.selectedCategory);
    const cityId = Number(this.selectedCity);

    if (this.searchTerm.trim()) {
      this.api.getServiceByName(this.searchTerm.trim()).subscribe({
        next: (res) => { this.services.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else if (catId) {
      this.api.getServicesByCategory(catId).subscribe({
        next: (res) => { this.services.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else if (cityId) {
      this.api.getServicesByCity(cityId).subscribe({
        next: (res) => { this.services.set(res.data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
    } else {
      this.loadServices();
    }
  }
}
