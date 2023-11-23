  import { Component } from '@angular/core';
  import { Router } from '@angular/router';
  import { AuthService } from '../auth.service';

  @Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
  })
  export class LoginComponent {
    email: string = '';
    password: string = '';
    loginError: string = '';

    constructor(private authService: AuthService, private router: Router) { }

    login(): void {
      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          // Login exitoso
          console.log('Login exitoso', response);
          console.log('Token recibido:', response.token);
          localStorage.setItem('token', response.token); // Almacena el token en localStorage
          this.router.navigate(['/inicio']); // Redirige a la página después del inicio de sesión
        },
        (error) => {
          // Error en el inicio de sesión
          console.error('Error en el inicio de sesión', error);

          if (error.status === 401) {
            this.loginError = 'Credenciales incorrectas';
          } else {
            this.loginError = 'Error en el servidor al intentar iniciar sesión';
          }
        }
      );
    }
  }
