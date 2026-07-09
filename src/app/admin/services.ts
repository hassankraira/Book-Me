import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { ServiceItem } from '../core/models';

@Component({
  selector: 'app-admin-services',
  imports: [],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Services</h1>
          <p class="mt-1 text-sm text-slate-400">View and manage all services on the platform</p>
        </div>
      </div>

      @if (loading()) {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 space-y-4 animate-pulse">
            @for (_ of [1,2,3,4]; track _) {
              <div class="flex items-center gap-4">
                <div class="h-10 w-10 rounded-lg bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/5"></div>
                </div>
                <div class="h-8 bg-slate-200 rounded-lg w-20"></div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100">
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Service</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Provider</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Price</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Status</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                @for (svc of services(); track svc.serviceId) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="h-8 w-8 rounded-lg bg-vibe-50 flex items-center justify-center text-xs shrink-0">🛠️</div>
                        <span class="font-semibold text-slate-900">{{ svc.serviceName }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-500">{{ svc.providerName || 'N/A' }}</td>
                    <td class="px-6 py-4 font-semibold text-slate-900">\${{ svc.price }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <button (click)="deleteSvc(svc.serviceId)"
                        class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="px-6 py-16 text-center text-slate-400">No services found</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminServices implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly services = signal<ServiceItem[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void { this.loadServices(); }

  private loadServices(): void {
    this.loading.set(true);
    this.api.getAllServicesWithDeleted().subscribe({
      next: (res) => { this.services.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  deleteSvc(id: number): void {
    if (!confirm('Delete this service?')) return;
    this.api.deleteService(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('Service deleted'); this.loadServices(); } },
      error: () => this.toast.error('Failed to delete'),
    });
  }
}
