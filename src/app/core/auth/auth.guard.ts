import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakAuthService } from './keycloak-auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(KeycloakAuthService);
  const router = inject(Router);

  await authService.init();

  if (authService.hasActiveSession()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], { queryParams: { redirectUrl: state.url } });
};
