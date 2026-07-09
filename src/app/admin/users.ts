import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { ToastService } from '../core/services/toast.service';
import { User } from '../core/models';

type RoleFilter = 'all' | 'User' | 'ServiceProvider';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-4 sm:px-6 py-16 max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">Users</h1>
          <p class="mt-1 text-sm text-slate-400">View all platform users</p>
        </div>
        <div class="flex gap-2">
          <input #searchInput type="text" (input)="searchTerm.set(searchInput.value)" placeholder="Search by name or email..."
            class="w-56 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-vibe-400 focus:ring-2 focus:ring-vibe-500/15 placeholder:text-slate-400" />
        </div>
      </div>

      <!-- Role filter tabs -->
      <div class="flex gap-2 mb-4">
        @for (opt of roleOptions; track opt.value) {
          <button (click)="setFilter(opt.value)"
            class="rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
            [class]="roleFilter() === opt.value ? 'bg-vibe-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'">
            {{ opt.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <div class="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div class="p-6 space-y-4 animate-pulse">
            @for (_ of [1,2,3,4]; track _) {
              <div class="flex items-center gap-4">
                <div class="h-10 w-10 rounded-full bg-slate-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
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
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Name</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Email</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Role</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Phone</th>
                  <th class="text-left px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                @for (u of filteredUsers(); track u.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        @if (u.imagePath) {
                          <img [src]="u.imagePath" class="h-9 w-9 rounded-full object-cover border border-slate-100 shrink-0" />
                        } @else {
                          <div class="h-9 w-9 rounded-full bg-vibe-100 flex items-center justify-center text-vibe-700 text-xs font-bold shrink-0">{{ u.firstName.charAt(0) }}{{ u.lastName.charAt(0) }}</div>
                        }
                        <span class="font-semibold text-slate-900">{{ u.firstName }} {{ u.lastName }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-slate-500">{{ u.email }}</td>
                    <td class="px-6 py-4">
                      @if (u.role) {
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          [class]="u.role === 'Admin'
  ? 'bg-vibe-100 text-vibe-800'
  : u.role === 'ServiceProvider'
    ? 'bg-amber-100 text-amber-800'
    : 'bg-slate-100 text-slate-700'">{{ u.role }}</span>
                      } @else {
                        <span class="text-slate-300">—</span>
                      }
                    </td>
                    <td class="px-6 py-4 text-slate-500">{{ u.phoneNumber || '—' }}</td>
                    <td class="px-6 py-4">
                      <button (click)="deleteUser(u.id)"
                        class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all">Delete</button>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="5" class="px-6 py-16 text-center text-slate-400">No users found</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <p class="text-sm text-slate-400">Page {{ page() }} · {{ filteredUsers().length }} user{{ filteredUsers().length !== 1 ? 's' : '' }}</p>
          <div class="flex gap-2">
            <button (click)="prevPage()" [disabled]="page() <= 1"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
            <button (click)="nextPage()" [disabled]="!hasMore()"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminUsers implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly roleOptions: { label: string; value: RoleFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Customers', value: 'User' },
    { label: 'Providers', value: 'ServiceProvider' },
  ];

  readonly users = signal<User[]>([]);
  readonly loading = signal(false);
  readonly page = signal(1);
  readonly hasMore = signal(false);
  readonly roleFilter = signal<RoleFilter>('all');
  readonly searchTerm = signal('');

  private readonly currentUserId = computed(() => this.auth.user()?.id);

  readonly filteredUsers = computed(() => {
    const currentId = this.currentUserId();
    const term = this.searchTerm().toLowerCase();
    let list = this.users();
    if (currentId) list = list.filter((u) => u.id !== currentId);
    if (!term) return list;
    return list.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void { this.loadUsers(); }

  setFilter(filter: RoleFilter): void {
    this.roleFilter.set(filter);
    this.page.set(1);
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    const filter = this.roleFilter();

    if (filter === 'User') {
      this.api.getCustomers(this.page(), 10).subscribe({
        next: (res) => {
          const tagged = (res.data || []).map((u: any) => ({ ...u, role: 'User' }));
          this.users.set(tagged);
          this.hasMore.set(tagged.length >= 10);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else if (filter === 'ServiceProvider') {
      this.api.getServiceProviders(this.page(), 10).subscribe({
        next: (res) => {
          const tagged = (res.data || []).map((u: any) => ({ ...u, role: 'ServiceProvider' }));
          this.users.set(tagged);
          this.hasMore.set(tagged.length >= 10);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else {
      // All: fetch from both endpoints, merge with roles, deduplicate by id
      let all: any[] = [];
      const seen = new Set<string>();
      let done = 0;
      const checkDone = () => { done++; if (done >= 2) { this.users.set(all); this.hasMore.set(all.length >= 10); this.loading.set(false); } };
      this.api.getCustomers(1, 50).subscribe({
        next: (res) => {
          for (const u of (res.data || [])) {
            if (!seen.has(u.id)) { seen.add(u.id); all.push({ ...u, role: 'User' }); }
          }
          checkDone();
        },
        error: () => checkDone(),
      });
      this.api.getServiceProviders(1, 50).subscribe({
        next: (res) => {
          for (const u of (res.data || [])) {
            if (!seen.has(u.id)) { seen.add(u.id); all.push({ ...u, role: 'ServiceProvider' }); }
          }
          checkDone();
        },
        error: () => checkDone(),
      });
    }
  }

  nextPage(): void {
    this.page.update((p) => p + 1);
    this.loadUsers();
  }

  prevPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.loadUsers();
    }
  }

  deleteUser(id: string): void {
    if (!confirm('Deactivate this user?')) return;
    this.api.deactivateUser(id).subscribe({
      next: (res) => { if (res.isSuccess) { this.toast.success('User deactivated'); this.loadUsers(); } },
      error: () => this.toast.error('Failed to deactivate'),
    });
  }
}
