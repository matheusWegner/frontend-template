import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { KeycloakAuthService } from '@core/auth/keycloak-auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  private readonly auth = inject(KeycloakAuthService);
  private readonly router = inject(Router);

  get username(): string {
    return this.auth.getUsername();
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
