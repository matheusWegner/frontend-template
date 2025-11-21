import { ApplicationConfig, APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { KeycloakAuthService } from '@core/auth/keycloak-auth.service';
import { authTokenInterceptor } from '@core/interceptors/auth-token.interceptor';

function initializeKeycloak(keycloakService: KeycloakAuthService) {
  return () => keycloakService.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch(), withInterceptors([authTokenInterceptor])),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeKeycloak,
      deps: [KeycloakAuthService]
    }
  ]
};
