import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:3000/auth/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(API_URL, { email, password }).pipe(
      tap(
        (response: any) => {
          console.log('Respuesta del servidor:', response);
          console.log('Token recibido:', response.token);
          localStorage.setItem('token', response.token);
          localStorage.setItem('rol', response.rol);
          this.router.navigate(['/items/add']);
        },
        (error) => console.error('Error en la solicitud de inicio de sesión:', error)
      )
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}
