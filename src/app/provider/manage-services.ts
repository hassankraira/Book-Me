import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { ServiceItem } from '../core/models';

@Component({
  selector: 'app-manage-services',
  imports: [RouterLink],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Services</h1>
          <p class="text-sm text-slate-400 mt-1">Manage your service offerings</p>
        </div>
        <a routerLink="/dashboard/services/new"
          class="inline-flex items-center gap-2 rounded-xl bg-vibe-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Service
        </a>
      </div>

      @if (loading()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          @for (_ of [1,2,3]; track _) {
            <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div class="aspect-[4/3] bg-slate-200"></div>
              <div class="p-5 space-y-3">
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                <div class="flex gap-2 pt-1">
                  <div class="h-9 w-16 bg-slate-200 rounded-xl"></div>
                  <div class="h-9 w-16 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (services().length === 0 && !loading()) {
        <div class="text-center py-20 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
          <div class="text-6xl mb-4">🛠️</div>
          <h2 class="text-xl font-bold text-slate-700">No services yet</h2>
          <p class="text-sm text-slate-400 mt-1 mb-6">Create your first service to start receiving bookings</p>
          <a routerLink="/dashboard/services/new" class="inline-flex rounded-xl bg-vibe-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all">
            Create Your First Service
          </a>
        </div>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (svc of services(); track svc.serviceId) {
          <div class="rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div class="aspect-[4/3] bg-slate-100 relative overflow-hidden">
              @if (svc.imagePath) {
                <img [src]="svc.imagePath" class="w-full h-full object-cover" />
              } @else {
                <div class="w-full h-full bg-gradient-to-br from-vibe-100 to-purple-100 flex items-center justify-center text-4xl">🛠️</div>
              }
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-base font-bold text-slate-900 truncate">{{ svc.serviceName }}</h3>
                <span class="text-base font-bold text-vibe-600 flex-shrink-0">\${{ svc.price }}</span>
              </div>
              <p class="text-sm text-slate-400 mt-1">{{ svc.estimatedDuration }} min</p>
              <span class="inline-flex mt-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
              <div class="mt-4 flex gap-2">
                <a [routerLink]="['/dashboard/services', svc.serviceId, 'edit']"
                  class="flex-1 text-center rounded-xl bg-vibe-600 px-4 py-2 text-sm font-medium text-white">
                  Edit
                </a>
                <button (click)="deleteSvc(svc.serviceId)"
                  class="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ManageServices implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly services = signal<ServiceItem[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void { this.loadServices(); }

  private loadServices(): void {
    this.loading.set(true);
    this.api.getAllActiveServices().subscribe({
      next: (res) => {
        const currentUserId = this.auth.user()?.id;
        this.services.set(res.data.filter((s) => s.serviceProviderId === currentUserId));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  deleteSvc(id: number): void {
    if (!confirm('Delete this service?')) return;
    this.api.deleteService(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('Service deleted'); this.loadServices(); } },
      error: () => this.toast.error('Failed to delete service'),
    });
  }
}
