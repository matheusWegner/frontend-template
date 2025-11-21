import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiClientService } from '@core/services/api-client.service';
import { KeycloakAuthService } from '@core/auth/keycloak-auth.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly auth = inject(KeycloakAuthService);

  protected readonly response = signal<string>('Clique em "Ping API" para testar.');
  protected readonly isLoading = signal(false);
  protected readonly userName = signal('');

  ngOnInit(): void {
    this.userName.set(this.auth.getUsername());
  }

  pingApi() {
    this.isLoading.set(true);
    this.api.pingSecureEndpoint().subscribe({
      next: (message) => {
        this.response.set(message);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('[DashboardPage] API error', error);
        this.response.set('Erro ao chamar API protegida. Verifique o console do navegador.');
        this.isLoading.set(false);
      }
    });
  }
}
