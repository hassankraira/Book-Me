import { inject } from '@angular/core';
import { Router, type CanActivateFn, type ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route?: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;
  const returnUrl = route?.url?.map((s) => s.path).join('/') || '';
  return router.parseUrl(returnUrl ? `/auth/login?returnUrl=/${returnUrl}` : '/auth/login');
};

export const roleGuard = (...roles: string[]): CanActivateFn => {
  return (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      const returnUrl = route?.url?.map((s) => s.path).join('/') || '';
      return router.parseUrl(returnUrl ? `/auth/login?returnUrl=/${returnUrl}` : '/auth/login');
    }
    if (roles.includes(auth.role() ?? '')) return true;
    return router.parseUrl('/');
  };
};
