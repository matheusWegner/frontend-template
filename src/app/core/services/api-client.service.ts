import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  readonly apiBaseUrl = environment.apiBaseUrl;

  pingSecureEndpoint(): Observable<string> {
    return this.http.get(`${this.apiBaseUrl}/hello`, { responseType: 'text' });
  }
}
