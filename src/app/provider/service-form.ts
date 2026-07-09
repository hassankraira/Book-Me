import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { ApiResponse, Category, City, ServiceItem } from '../core/models';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-service-form',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <a routerLink="/dashboard/services" class="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-3">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to My Services
        </a>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">{{ isEdit() ? 'Edit Service' : 'Create Service' }}</h1>
        <p class="text-sm text-slate-400 mt-1">{{ isEdit() ? 'Update your service details' : 'Add a new service to your catalog' }}</p>
      </div>

      @if (error()) {
        <div class="rounded-xl bg-rose-50 border border-rose-100 p-4 text-rose-700 mb-6">{{ error() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="card">
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Service Name</label>
            <input #nameRef="ngModel" type="text" [(ngModel)]="form.name" name="name" required placeholder="e.g. Haircut, Plumbing, Tutoring"
              class="input-base"
              [class.input-error]="nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())" />
            @if (nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())) {
              <div class="field-error">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                Service name is required
              </div>
            }
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="4" placeholder="Describe your service in detail..."
              class="textarea-base"></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1.5">Service Photo</label>
            <input type="file" (change)="onPhotoSelected($event)" accept="image/*"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-vibe-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-vibe-700 hover:file:bg-vibe-100" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Price ($)</label>
              <input #priceRef="ngModel" type="number" [(ngModel)]="form.price" name="price" required min="0" step="0.01" placeholder="0.00"
                class="input-base"
                [class.input-error]="priceRef.invalid && (priceRef.dirty || priceRef.touched || submitted())" />
              @if (priceRef.invalid && (priceRef.dirty || priceRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  @if (priceRef.errors?.['required']) { Price is required }
                  @if (priceRef.errors?.['min']) { Price must be 0 or more }
                </div>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Duration (minutes)</label>
              <input #durRef="ngModel" type="number" [(ngModel)]="form.durationMinutes" name="durationMinutes" required min="15" step="15" placeholder="60"
                class="input-base"
                [class.input-error]="durRef.invalid && (durRef.dirty || durRef.touched || submitted())" />
              @if (durRef.invalid && (durRef.dirty || durRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  @if (durRef.errors?.['required']) { Duration is required }
                  @if (durRef.errors?.['min']) { Minimum 15 minutes }
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <select #catRef="ngModel" [(ngModel)]="form.categoryId" name="categoryId" required
                class="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20 bg-white"
                [class.input-error]="catRef.invalid && (catRef.dirty || catRef.touched || submitted())">
                <option value="">Select category</option>
                @for (cat of categories(); track cat.id) { <option [value]="cat.id">{{ cat.name }}</option> }
              </select>
              @if (catRef.invalid && (catRef.dirty || catRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  Category is required
                </div>
              }
            </div>
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
              <select #cityRef="ngModel" [(ngModel)]="form.cityId" name="cityId" required
                class="w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20 bg-white"
                [class.input-error]="cityRef.invalid && (cityRef.dirty || cityRef.touched || submitted())">
                <option value="">Select city</option>
                @for (c of cities(); track c.cityId) { <option [value]="c.cityId">{{ c.cityName }}</option> }
              </select>
              @if (cityRef.invalid && (cityRef.dirty || cityRef.touched || submitted())) {
                <div class="field-error">
                  <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                  City is required
                </div>
              }
            </div>
          </div>

          <div class="rounded-xl p-5 border border-vibe-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-vibe-500 to-purple-600 flex items-center justify-center text-white text-lg">⏰</div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">Availability</h3>
                <p class="text-sm text-slate-500">Set your daily working hours</p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Start Time</label>
                <input type="time" [(ngModel)]="startTime" name="startTime"
                  class="w-full rounded-xl border border-vibe-200 px-4 py-3 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">End Time</label>
                <input type="time" [(ngModel)]="endTime" name="endTime"
                  class="w-full rounded-xl border border-vibe-200 px-4 py-3 outline-none focus:border-vibe-500 focus:ring-2 focus:ring-vibe-500/20" />
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-slate-100 px-6 py-4">
          <button type="submit" [disabled]="submitting()"
            class="w-full rounded-xl bg-purple-600 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-60 transition-all duration-200">
            @if (submitting()) {
              <span class="inline-block animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 align-middle"></span>
            }
            {{ submitting() ? 'Saving...' : (isEdit() ? 'Update Service' : 'Create Service') }}
          </button>
        </div>
      </form>
    </div>`,
})
export class ServiceForm implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly categories = signal<Category[]>([]);
  readonly cities = signal<City[]>([]);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal(false);

  startTime = '09:00';
  endTime = '17:00';

  form = { name: '', description: '', price: 0, durationMinutes: 60, categoryId: 0, cityId: 0 };
  private photoFile: File | null = null;
  private editId = 0;
  readonly isEdit = () => this.editId > 0;

  ngOnInit(): void {
    this.editId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.loadCategories();
    this.loadCities();
    if (this.editId) this.loadService();
  }

  private loadCategories(): void { this.api.getCategories().subscribe({ next: (res) => this.categories.set(res.data) }); }
  private loadCities(): void { this.api.getCities().subscribe({ next: (res) => this.cities.set(res.data) }); }

  private loadService(): void {
    this.api.getService(this.editId).subscribe({
      next: (res) => {
        const s = res.data as any;
        const categoryId = s.categoryId ?? this.findCategoryIdByName(s.categoryName);
        const cityId = s.cityId ?? this.findCityIdByName(s.cityName);

        this.form = {
          name: s.serviceName ?? s.name ?? '',
          description: s.description ?? '',
          price: s.price ?? 0,
          durationMinutes: s.estimatedDuration ?? s.durationMinutes ?? 60,
          categoryId: categoryId ?? 0,
          cityId: cityId ?? 0,
        };

        this.startTime = this.formatTimeForInput(s.startWork ?? s.startTime ?? s.start_work ?? '');
        this.endTime = this.formatTimeForInput(s.endWork ?? s.endTime ?? s.end_work ?? '');
      },
      error: () => this.error.set('Failed to load service'),
    });
  }

  private findCategoryIdByName(name?: string): number {
    if (!name) return 0;
    const cat = this.categories().find((c) => c.name === name);
    return cat ? cat.id : 0;
  }

  private findCityIdByName(name?: string): number {
    if (!name) return 0;
    const city = this.cities().find((c) => c.cityName === name);
    return city ? city.cityId : 0;
  }

  private formatTimeForInput(value?: string): string {
    if (!value) return '';
    let time = value.includes('T') ? value.split('T').pop() ?? value : value;
    const m = time.match(/(\d{1,2}):(\d{2})/);
    if (!m) return '';
    return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.photoFile = input.files?.item(0) || null;
  }

  private toTimeString(v: string): string {
    const m = v.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (!m) return v;
    let h = +m[1];
    if (m[3]?.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (m[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${m[2]}:00`;
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.form.name || !this.form.categoryId || !this.form.cityId) return;
    this.submitting.set(true);
    this.error.set(null);
    if (this.editId) {
      let params = new HttpParams()
        .set('Name', this.form.name)
        .set('Description', this.form.description)
        .set('Price', String(this.form.price))
        .set('EstimatedDuration', String(this.form.durationMinutes))
        .set('StartWork', this.toTimeString(this.startTime))
        .set('EndWork', this.toTimeString(this.endTime))
        .set('CategoryId', String(this.form.categoryId))
        .set('CityId', String(this.form.cityId));
      this.api.updateService(this.editId, params, this.photoFile || undefined).subscribe(this.handleResult());
    } else {
      const params = new HttpParams()
        .set('Name', this.form.name)
        .set('Description', this.form.description)
        .set('Price', String(this.form.price))
        .set('EstimatedDuration', String(this.form.durationMinutes))
        .set('StartWork', this.toTimeString(this.startTime))
        .set('EndWork', this.toTimeString(this.endTime))
        .set('CityId', String(this.form.cityId))
        .set('CategoryId', String(this.form.categoryId));
      this.api.createService(params, this.photoFile || undefined).subscribe(this.handleResult());
    }
  }

  private handleResult(): Partial<Observer<ApiResponse<ServiceItem>>> {
    return {
      next: (res) => {
        if (res.isSuccess) {
          this.toast.success(this.editId ? 'Service updated' : 'Service created');
          this.router.navigate(['/dashboard/services']);
        } else { this.error.set(res.message); }
        this.submitting.set(false);
      },
      error: (err) => {
        const msg = err.error?.message || err.error?.title || (err.error?.errors ? Object.values(err.error.errors).flat().join(', ') : '') || 'Failed to save service';
        this.error.set(msg);
        this.submitting.set(false);
      },
    };
  }
}
