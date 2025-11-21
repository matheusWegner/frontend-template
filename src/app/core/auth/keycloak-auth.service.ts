import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import Keycloak, { KeycloakInitOptions, KeycloakLoginOptions } from 'keycloak-js';
import { environment } from '@env/environment';

type TokenProfile = {
  username?: string;
  email?: string;
  name?: string;
  roles: string[];
};

@Injectable({ providedIn: 'root' })
export class KeycloakAuthService {
  private keycloak: Keycloak | null = null;
  private readonly platformId = inject(PLATFORM_ID);
  private initialized = signal(false);
  private authenticated = signal(false);
  private profile = signal<TokenProfile | null>(null);
  private initPromise: Promise<boolean> | null = null;
  private readonly requestedScopes = "email profile openid";

  readonly isReady = computed(() => this.initialized());
  readonly isAuthenticated = computed(() => this.authenticated());
  readonly userProfile = computed(() => this.profile());

  private get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private ensureKeycloakInstance(): Keycloak | null {
    if (!this.keycloak && this.isBrowser) {
      this.keycloak = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      });
    }
    return this.keycloak;
  }

  async init(options?: KeycloakInitOptions): Promise<boolean> {
    if (this.initialized()) {
      return this.authenticated();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    if (!this.isBrowser) {
      this.initialized.set(true);
      return false;
    }

    const kc = this.ensureKeycloakInstance();
    if (!kc) {
      this.initialized.set(true);
      return false;
    }

    const defaultOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    };

    if (this.requestedScopes) {
      defaultOptions.scope = this.requestedScopes;
    }

    this.initPromise = (async () => {
      const isAuthenticated = await kc.init({ ...defaultOptions, ...options });
      this.authenticated.set(isAuthenticated);

      if (isAuthenticated) {
        this.refreshProfileFromToken();
      }

      this.initialized.set(true);
      return isAuthenticated;
    })();

    const result = await this.initPromise;
    this.initPromise = null;
    return result;
  }

  async login(redirectUri?: string) {
    const kc = this.ensureKeycloakInstance();
    if (!kc) {
      return;
    }

    const target = redirectUri ?? (typeof window !== 'undefined' ? window.location.href : undefined);
    const loginOptions: KeycloakLoginOptions = this.requestedScopes
      ? { redirectUri: target, scope: this.requestedScopes }
      : { redirectUri: target };
    return kc.login(loginOptions);
  }

  async logout(redirectUri?: string) {
    const kc = this.ensureKeycloakInstance();
    if (!kc) {
      return;
    }

    const target = redirectUri ?? (typeof window !== 'undefined' ? window.location.origin : undefined);
    return kc.logout({ redirectUri: target });
  }

  async updateToken(minValidity = 30): Promise<string | undefined> {
    const kc = this.ensureKeycloakInstance();
    if (!kc?.authenticated) {
      return undefined;
    }

    const refreshed = await kc.updateToken(minValidity);
    if (refreshed) {
      this.refreshProfileFromToken();
    }

    return kc.token;
  }

  async getValidToken(minValidity = 30): Promise<string | undefined> {
    const kc = this.ensureKeycloakInstance();
    if (!kc?.authenticated) {
      return undefined;
    }

    await this.updateToken(minValidity);
    return kc.token;
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  getIdToken(): string | undefined {
    return this.keycloak?.idToken;
  }

  getUsername(): string {
    return (this.keycloak?.tokenParsed as Record<string, string> | undefined)?.['preferred_username'] ?? '';
  }

  hasActiveSession(): boolean {
    return this.authenticated();
  }

  isInitializationComplete(): boolean {
    return this.initialized();
  }

  getProfileSnapshot(): TokenProfile | null {
    return this.profile();
  }

  private refreshProfileFromToken() {
    const tokenParsed = this.keycloak?.idTokenParsed as Record<string, unknown> | undefined
      ?? (this.keycloak?.tokenParsed as Record<string, unknown> | undefined);
    if (!tokenParsed) {
      return;
    }
  
  }
}
