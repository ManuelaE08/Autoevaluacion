import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private myAppUrl: string;
  private myApiUrl: string;
  private deleteUsr: string;

  constructor(private http: HttpClient, private _token: AuthService) { 
    this.myAppUrl = environment.apiUrl;
    this.myApiUrl = '/user/';
    this.deleteUsr = 'eliminar/';
  }

  getListUsuarios(): Observable<Usuario[]>{
    const token = this._token.getToken();
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<Usuario[]>(`${this.myAppUrl}${this.myApiUrl}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un usuario:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   deleteUsuario(id: number): Observable<void>{
    const token = this._token.getToken();
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${this.deleteUsr}${id}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para eliminar un usuario:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   saveUsuario(usuario: Usuario): Observable<void>{
    const token = this._token.getToken();
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}agregar/`,usuario,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un usuario:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   getUsuario(id:number): Observable<Usuario>{
    const token = this._token.getToken();
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<Usuario>(`${this.myAppUrl}${this.myApiUrl}${id}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para obtener un usuario:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
   }
  }

   updateUsuario(usuario:Usuario): Observable<void>{
    const token = this._token.getToken();
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}editar/${usuario.id}`,usuario,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para actualizar un usuario:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
   }
  }
}