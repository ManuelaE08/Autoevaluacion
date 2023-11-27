import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private authService: AuthService, private router: Router, private jwtHelper: JwtHelperService) { }

  login(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response) => {
        // Login exitoso
        console.log('Login exitoso', response);
        console.log('Token recibido:', response.token);
        localStorage.setItem('token', response.token); // Almacena el token en localStorage

        // Extrae el rol y userId del token
        const decodedToken = this.jwtHelper.decodeToken(response.token);
        const userRol = decodedToken.rol;
        const userId = decodedToken.userId;

        if (userRol === 'docente') {
          // Redirige a la página autoevaluacion con el userId en la URL
          this.router.navigate(['/autoevaluacion', userId]);
        } else {
          // Redirige a la página después del inicio de sesión (por ejemplo, '/inicio')
          this.router.navigate(['/inicio']);
        }
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
