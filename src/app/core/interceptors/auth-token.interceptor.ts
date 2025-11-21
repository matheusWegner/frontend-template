import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { KeycloakAuthService } from '@core/auth/keycloak-auth.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(KeycloakAuthService);

  return from(authService.getValidToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`
      };

      const authReq = req.clone({ setHeaders: headers });
      return next(authReq);
    })
  );
};
