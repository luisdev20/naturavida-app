import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/usuarios`;
  private _currentUser = signal<Usuario | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.rol === 'admin');

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('natura_user');
      if (stored) {
        this._currentUser.set(JSON.parse(stored));
      }
    }
  }

  login(email: string, password: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      tap(users => {
        if (users.length > 0) {
          this._currentUser.set(users[0]);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('natura_user', JSON.stringify(users[0]));
          }
        }
      })
    );
  }

  registro(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, { ...usuario, rol: 'cliente' }).pipe(
      tap(newUser => {
        this._currentUser.set(newUser);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('natura_user', JSON.stringify(newUser));
        }
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('natura_user');
    }
  }
}
