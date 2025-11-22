import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakAuthService } from './keycloak-auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(KeycloakAuthService);
  const router = inject(Router);

  console.log('[AuthGuard] Checking authentication for:', state.url);

  if (!authService.isInitializationComplete()) {
    console.log('[AuthGuard] Initializing Keycloak...');
    await authService.init();
  }

  if (authService.hasActiveSession()) {
    console.log('[AuthGuard] Authentication successful');
    return true;
  }

  console.log('[AuthGuard] No active session, redirecting to login');
  return router.createUrlTree(['/auth/login'], { queryParams: { redirectUrl: state.url } });
};
