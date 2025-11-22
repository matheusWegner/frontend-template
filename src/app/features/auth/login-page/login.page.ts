import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakAuthService } from '@core/auth/keycloak-auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private readonly authService = inject(KeycloakAuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  private readonly redirectUrl = signal<string>('/dashboard');

  ngOnInit(): void {
    const requestedRedirect = this.route.snapshot.queryParamMap.get('redirectUrl');
    if (requestedRedirect) {
      this.redirectUrl.set(requestedRedirect);
    }

    this.bootstrapSession();
  }

  private async bootstrapSession() {
    try {
      console.log('[LoginPage] Starting bootstrap, URL:', window.location.href);
      
      // Initialize Keycloak - it will automatically detect and process OAuth callback
      await this.authService.init();
      
      if (this.authService.hasActiveSession()) {
        console.log('[LoginPage] Session active, redirecting to:', this.redirectUrl());
        this.router.navigateByUrl(this.redirectUrl());
        return;
      }
      
      console.log('[LoginPage] No active session');
    } catch (error) {
      console.error('[LoginPage] initialization error', error);
      this.errorMessage.set('Não foi possível inicializar a autenticação. Tente novamente em instantes.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async startLogin() {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    try {
      const redirectUri = typeof window !== 'undefined' ? `${window.location.origin}/auth/login` : undefined;
      await this.authService.login(redirectUri);
    } catch (error) {
      console.error('[LoginPage] login error', error);
      this.errorMessage.set('Falha ao redirecionar para o Keycloak.');
      this.isLoading.set(false);
    }
  }
}
