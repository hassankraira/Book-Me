import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ServiceItem } from '../core/models';

@Component({
  selector: 'app-category-services',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50">
      <div class="bg-white border-b border-slate-100">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <a routerLink="/Categories" class="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-vibe-600 transition-colors mb-4">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            All Categories
          </a>
          <div class="flex items-start gap-6">
            @if (categoryImage()) {
              <div class="hidden sm:block w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <img [src]="categoryImage()" class="w-full h-full object-cover" />
              </div>
            }
            <div class="min-w-0 flex-1">
              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">{{ categoryName() }}</h1>
              <p class="mt-1 text-sm text-slate-500 line-clamp-2">{{ categoryDescription() }}</p>
              <p class="mt-1 text-sm font-medium text-vibe-600">{{ filtered().length }} service{{ filtered().length !== 1 ? 's' : '' }} available</p>
              <p class="mt-0.5 text-xs text-slate-400">Page {{ page() }} of {{ totalPages() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" [ngModel]="search()" (ngModelChange)="search.set($event); page.set(1)" placeholder="Search services..."
                class="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-vibe-500/20 focus:border-vibe-500 transition-all" />
            </div>
            <select [ngModel]="cityFilter()" (ngModelChange)="cityFilter.set($event); page.set(1)"
              class="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-vibe-500/20 focus:border-vibe-500 transition-all">
              <option value="all">All Cities</option>
              <option value="near">Near You</option>
              <option value="far">Far From You</option>
            </select>
            <select [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event); page.set(1)"
              class="rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-vibe-500/20 focus:border-vibe-500 transition-all">
              <option value="name">A-Z</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            @for (_ of [1,2,3]; track _) {
              <div class="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                <div class="aspect-[4/3] bg-slate-100"></div>
                <div class="p-5 space-y-3">
                  <div class="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div class="h-3 bg-slate-100 rounded w-full"></div>
                  <div class="h-3 bg-slate-100 rounded w-2/3"></div>
                  <div class="h-8 bg-slate-100 rounded-xl w-14"></div>
                </div>
              </div>
            }
          </div>
        }

        @if (!loading() && filtered().length === 0) {
          <div class="text-center py-20">
            <div class="text-5xl mb-4">🔍</div>
            <h2 class="text-lg font-bold text-slate-700">No services found</h2>
            <p class="text-sm text-slate-400 mt-1">{{ search() ? 'Try a different search term' : 'This category doesn\'t have any services yet' }}</p>
            @if (search()) {
              <button (click)="search.set('')" class="mt-3 text-sm font-medium text-vibe-600 hover:text-vibe-700 underline">Clear search</button>
            }
          </div>
        }

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (svc of paginated(); track svc.serviceId) {
            <a [routerLink]="['/service', svc.serviceId]"
              class="group rounded-2xl bg-white border border-slate-100 hover:border-vibe-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block overflow-hidden shadow-sm">
              <div class="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                @if (svc.imagePath) {
                  <img [src]="svc.imagePath" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                } @else {
                  <div class="w-full h-full bg-gradient-to-br from-vibe-50 to-purple-50 flex items-center justify-center text-5xl">🛠️</div>
                }
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-base font-bold text-slate-900 leading-snug">{{ svc.serviceName }}</h3>
                  <span class="text-lg font-bold text-vibe-600 shrink-0">\${{ svc.price }}</span>
                </div>
                <p class="mt-1.5 text-sm text-slate-400 line-clamp-2 leading-relaxed">{{ svc.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center gap-2 text-sm text-slate-400">
                    @if (svc.cityName) { <span>{{ svc.cityName }}</span> }
                    @if (svc.cityName) { <span>·</span> }
                    <span>{{ svc.estimatedDuration }} min</span>
                  </div>
                  <span class="inline-flex items-center gap-1 rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors"
                    [class]="auth.role() === 'Admin' ? 'bg-slate-100 text-slate-400' : 'bg-purple-600 text-white group-hover:bg-purple-700'">
                    {{ auth.role() === 'Admin' ? 'View Details' : 'Book' }}
                    <svg class="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </a>
          }
        </div>

        @if (!loading() && filtered().length > 0) {
          <div class="flex items-center justify-between mt-8 mb-4">
            <p class="text-sm text-slate-400">Showing {{ paginated().length }} of {{ filtered().length }} services</p>
            <div class="flex gap-2">
              <button (click)="prevPage()" [disabled]="page() <= 1"
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
              <button (click)="nextPage()" [disabled]="page() >= totalPages()"
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
          <section class="mt-4 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
            <div class="grid grid-cols-1 lg:grid-cols-2">
              @if (categoryImage()) {
                <div class="h-64 lg:h-full bg-slate-50 overflow-hidden">
                  <img [src]="categoryImage()" class="h-full w-full object-cover" />
                </div>
              }
              <div class="p-8 sm:p-10">
                <span class="inline-flex rounded-full bg-vibe-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-vibe-700">About {{ categoryName() }}</span>
                <p class="mt-4 text-sm text-slate-600 leading-7">{{ categoryDescription() }}</p>
                <div class="mt-6 grid gap-3 sm:grid-cols-2">
                  <div class="rounded-xl bg-slate-50 p-4">
                    <h3 class="text-sm font-semibold text-slate-900">Trusted providers</h3>
                    <p class="mt-1 text-xs text-slate-500">All professionals are reviewed and rated.</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <h3 class="text-sm font-semibold text-slate-900">Easy booking</h3>
                    <p class="mt-1 text-xs text-slate-500">Book in just a few clicks.</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <h3 class="text-sm font-semibold text-slate-900">Fast support</h3>
                    <p class="mt-1 text-xs text-slate-500">We're here to help.</p>
                  </div>
                  <div class="rounded-xl bg-slate-50 p-4">
                    <h3 class="text-sm font-semibold text-slate-900">Flexible scheduling</h3>
                    <p class="mt-1 text-xs text-slate-500">Find the perfect time.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }
      </div>
    </div>
  `,
})
export class CategoryServices implements OnInit {
  private readonly api = inject(ApiService);
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly services = signal<ServiceItem[]>([]);
  readonly loading = signal(false);
  readonly categoryName = signal('');
  readonly categoryDescription = signal('');
  readonly categoryImage = signal('');
  readonly search = signal('');
  readonly cityFilter = signal('all');
  readonly sortBy = signal('name');
  readonly page = signal(1);
  readonly pageSize = 9;

  readonly filtered = computed(() => {
    let list = this.services();
    const city = this.auth.user()?.cityName?.toLowerCase();
    const filter = this.cityFilter();
    if (filter === 'near' && city) {
      list = list.filter(s => s.cityName?.toLowerCase() === city);
    } else if (filter === 'far' && city) {
      list = list.filter(s => s.cityName?.toLowerCase() !== city);
    }
    const q = this.search().toLowerCase();
    if (q) {
      list = list.filter(s => s.serviceName.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q));
    }
    const sort = this.sortBy();
    if (sort === 'price-low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return [...list].sort((a, b) => b.price - a.price);
    return [...list].sort((a, b) => a.serviceName.localeCompare(b.serviceName));
  });

  readonly paginated = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));

  private categoryId = 0;

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.categoryId) this.loadCategory();
  }

  nextPage(): void { if (this.page() < this.totalPages()) this.page.update((p) => p + 1); }
  prevPage(): void { if (this.page() > 1) this.page.update((p) => p - 1); }

  private loadCategory(): void {
    this.loading.set(true);
    this.api.getCategory(this.categoryId).subscribe({
      next: (res) => {
        this.categoryName.set(res.data.name);
        this.categoryDescription.set(res.data.description || 'Explore top services in this category and find the best professional for your needs.');
        this.categoryImage.set(res.data.imagePath || '');
      },
    });
    this.api.getServicesByCategory(this.categoryId).subscribe({
      next: (res) => { this.services.set(res.data); this.loading.set(false); this.page.set(1); },
      error: () => this.loading.set(false),
    });
  }
}
