import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { City } from '../core/models';

@Component({
  selector: 'app-admin-cities',
  imports: [FormsModule],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <div class="h-12 w-12 rounded-2xl bg-vibe-600 flex items-center justify-center text-white text-xl shrink-0">🏙️</div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Cities</h1>
          <p class="text-sm text-slate-400 mt-0.5">Manage service coverage locations</p>
        </div>
      </div>
        <div class="rounded-lg bg-white shadow-sm border border-slate-100 p-5 mb-6">
          <h2 class="text-base font-bold text-slate-900 mb-4">{{ editId ? 'Edit City' : 'Add New City' }}</h2>
          <form (ngSubmit)="onSubmit()" class="flex gap-3 items-end">
            <div class="flex-1">
              <input #nameRef="ngModel" type="text" [(ngModel)]="formName" name="name" placeholder="City name" required
                class="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15"
                [class.input-error]="nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())" />
              @if (nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  City name is required
                </div>
              }
            </div>
            <button type="submit" class="rounded-lg bg-vibe-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 transition-all">{{ editId ? 'Update' : 'Add' }}</button>
            @if (editId) {
              <button type="button" (click)="resetForm()" class="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
            }
          </form>
        </div>

        @if (loading()) {
          <div class="animate-pulse rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
            <table class="w-full text-sm">
              <thead><tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-16"></div></th>
                <th class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-14"></div></th>
              </tr></thead>
              <tbody class="divide-y divide-slate-50">
                @for (_ of [1,2,3,4]; track _) {
                  <tr>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <div class="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Name</th>
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (c of cities(); track c.cityId) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4 font-semibold text-slate-900">{{ c.cityName }}</td>
                  <td class="px-6 py-4 flex gap-2">
                    <button (click)="edit(c)" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">Edit</button>
                    <button (click)="deleteCity(c.cityId)" class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                  </td>
                </tr>
              } @empty {
                @if (!loading()) { <tr><td colspan="2" class="px-6 py-16 text-center text-slate-400">No cities</td></tr> }
              }
            </tbody>
          </table>
      </div>
    </div>
  `,
})
export class AdminCities implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly cities = signal<City[]>([]);
  readonly loading = signal(false);
  readonly submitted = signal(false);
  formName = '';
  editId = 0;

  ngOnInit(): void { this.loadCities(); }

  private loadCities(): void {
    this.loading.set(true);
    this.api.getCities().subscribe({
      next: (res) => { this.cities.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  resetForm(): void { this.formName = ''; this.editId = 0; }

  edit(c: City): void { this.editId = c.cityId; this.formName = c.cityName; }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.formName.trim()) return;
    if (this.editId) {
      this.api.updateCity(this.editId, { cityName: this.formName }).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('City updated'); this.resetForm(); this.loadCities(); } },
        error: () => this.toast.error('Update failed'),
      });
    } else {
      this.api.createCity({ cityName: this.formName }).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('City created'); this.resetForm(); this.loadCities(); } },
        error: () => this.toast.error('Create failed'),
      });
    }
  }

  deleteCity(id: number): void {
    if (!confirm('Delete this city?')) return;
    this.api.deleteCity(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('City deleted'); this.loadCities(); } },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
