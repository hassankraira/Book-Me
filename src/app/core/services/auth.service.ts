import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models';

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    const role = payload[ROLE_CLAIM];
    if (!role) return null;
    const roles = Array.isArray(role) ? role : [role];
    const lower = roles.map((r: string) => r.toLowerCase());
    if (lower.includes('admin')) return 'Admin';
    if (lower.includes('serviceprovider')) return 'ServiceProvider';
    if (lower.includes('user')) return 'User';
    return roles[0] || null;
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('bookme_user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('bookme_user');
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  private readonly userSignal = signal<User | null>(getStoredUser());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem('bookme_token'));

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  readonly role = computed(() => {
    const override = localStorage.getItem('bookme_role_override');
    if (override) return override;
    const token = this.tokenSignal();
    if (token) {
      const jwtRole = getRoleFromToken(token);
      if (jwtRole) return jwtRole;
    }
    return this.userSignal()?.role || null;
  });

  readonly isAdmin = computed(() => this.role() === 'Admin');
  readonly isProvider = computed(() => this.role() === 'ServiceProvider');
  readonly isCustomer = computed(() => this.role() === 'User');
  readonly userName = computed(() => {
    const u = this.userSignal();
    if (!u) return '';
    return `${u.firstName} ${u.lastName}`;
  });

  saveAuth(token: string, user: User): void {
    localStorage.setItem('bookme_token', token ?? '');
    localStorage.setItem('bookme_user', JSON.stringify(user));
    this.tokenSignal.set(token ?? null);
    this.userSignal.set(user ?? null);
  }

  logout(): void {
    localStorage.removeItem('bookme_token');
    localStorage.removeItem('bookme_user');
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }

  updateUser(user: User): void {
    localStorage.setItem('bookme_user', JSON.stringify(user));
    this.userSignal.set(user);
  }
}
