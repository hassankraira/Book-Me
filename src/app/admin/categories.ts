import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/services/api.service';
import { ToastService } from '../core/services/toast.service';
import { Category } from '../core/models';

@Component({
  selector: 'app-admin-categories',
  imports: [FormsModule],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-5xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <div class="h-12 w-12 rounded-2xl bg-vibe-600 flex items-center justify-center text-white text-xl shrink-0">📂</div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Categories</h1>
          <p class="text-sm text-slate-400 mt-0.5">Organize services into categories</p>
        </div>
      </div>
        <div class="rounded-2xl bg-white border border-slate-100 p-6 mb-8 shadow-sm">
          <h2 class="text-lg font-bold text-slate-900 mb-5">{{ editId ? 'Edit Category' : 'Add New Category' }}</h2>
          <form (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input #nameRef="ngModel" type="text" [(ngModel)]="formName" name="name" placeholder="Category name" required
                  class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 transition-all"
                  [class.input-error]="nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())" />
                @if (nameRef.invalid && (nameRef.dirty || nameRef.touched || submitted())) {
                  <div class="field-error">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                    Category name is required
                  </div>
                }
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <input type="text" [(ngModel)]="formDescription" name="description" placeholder="Short description"
                  class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 transition-all" />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Photo</label>
              <div class="flex items-center gap-4">
                <button type="button" (click)="fileInput.click()"
                  class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                  Choose Image
                </button>
                @if (formImagePreview()) {
                  <div class="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200">
                    <img [src]="formImagePreview()" class="h-full w-full object-cover" />
                    <button type="button" (click)="removeImage()"
                      class="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600">×</button>
                  </div>
                }
                <input #fileInput type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" />
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button type="submit"
                class="rounded-xl bg-vibe-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-vibe-700 transition-all">{{ editId ? 'Update' : 'Add' }}</button>
              @if (editId) {
                <button type="button" (click)="resetForm()"
                  class="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              }
            </div>
          </form>
        </div>

        @if (loading()) {
          <div class="animate-pulse rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead><tr class="bg-slate-50 border-b border-slate-100">
                <th class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-16"></div></th>
                <th class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-24"></div></th>
                <th class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-14"></div></th>
              </tr></thead>
              <tbody class="divide-y divide-slate-50">
                @for (_ of [1,2,3,4]; track _) {
                  <tr>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-40"></div></td>
                    <td class="px-6 py-4"><div class="h-4 bg-slate-200 rounded w-16"></div></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <div class="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100">
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Photo</th>
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Name</th>
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Description</th>
                <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (cat of categories(); track cat.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-3">
                    @if (cat.imagePath) {
                      <img [src]="cat.imagePath" class="h-10 w-10 rounded-lg object-cover border border-slate-100" />
                    } @else {
                      <div class="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">📂</div>
                    }
                  </td>
                  <td class="px-6 py-3 font-semibold text-slate-900">{{ cat.name }}</td>
                  <td class="px-6 py-3 text-slate-500 max-w-xs truncate">{{ cat.description }}</td>
                  <td class="px-6 py-3">
                    <div class="flex gap-2">
                      <button (click)="edit(cat)"
                        class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all">Edit</button>
                      <button (click)="deleteCat(cat.id)"
                        class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                @if (!loading()) {
                  <tr><td colspan="4" class="px-6 py-16 text-center text-slate-400">No categories</td></tr>
                }
              }
            </tbody>
          </table>
      </div>
    </div>
  `,
})
export class AdminCategories implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(false);
  readonly submitted = signal(false);
  formName = '';
  formDescription = '';
  editId = 0;
  formImageFile: File | null = null;
  readonly formImagePreview = signal<string | null>(null);

  ngOnInit(): void { this.loadCategories(); }

  private loadCategories(): void {
    this.loading.set(true);
    this.api.getCategories().subscribe({
      next: (res) => { this.categories.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  resetForm(): void {
    this.formName = ''; this.formDescription = ''; this.editId = 0;
    this.formImageFile = null; this.formImagePreview.set(null);
  }

  edit(cat: Category): void {
    this.editId = cat.id;
    this.formName = cat.name;
    this.formDescription = cat.description;
    this.formImageFile = null;
    this.formImagePreview.set(cat.imagePath || null);
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.formImageFile = file;
    const reader = new FileReader();
    reader.onload = () => this.formImagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void { this.formImageFile = null; this.formImagePreview.set(null); }

  onSubmit(): void {
    this.submitted.set(true);
    if (!this.formName.trim()) return;
    if (this.editId) {
      this.api.updateCategory(this.editId, this.formName, this.formDescription, this.formImageFile || undefined).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('Category updated'); this.resetForm(); this.loadCategories(); } },
        error: (err) => { const msg = err?.error?.message; this.toast.error(msg || 'Update failed'); },
      });
    } else {
      const payload: any = { name: this.formName, description: this.formDescription };
      if (this.formImagePreview()) {
        payload.imagePath = this.formImagePreview();
      }
      this.api.createCategory(payload).subscribe({
        next: (res) => { if (res.isSuccess) { this.toast.success('Category created'); this.resetForm(); this.loadCategories(); } },
        error: (err) => { const msg = err?.error?.message; this.toast.error(msg || 'Create failed'); },
      });
    }
  }

  deleteCat(id: number): void {
    if (!confirm('Delete this category?')) return;
    this.api.deleteCategory(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('Category deleted'); this.loadCategories(); } },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
