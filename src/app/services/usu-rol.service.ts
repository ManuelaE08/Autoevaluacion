import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuRol } from '../interfaces/usu-rol';

@Injectable({
  providedIn: 'root'
})
export class UsuRolService {
  private myAppUrl: string;
  private myApiUrl: string;
  private deleteUsr: string;

  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.apiUrl;
    this.myApiUrl = '/usu-rol/';
    this.deleteUsr = 'eliminar/';
  }

  getUsuRoles(): Observable<UsuRol[]>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<UsuRol[]>(`${this.myAppUrl}${this.myApiUrl}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un use-rol:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   deleteUsuRol(id_us: number, id_rol: number): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${this.deleteUsr}${id_us}/${id_rol}`, {headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para eliminar un use-rol:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   saveUsuRol(userol: UsuRol): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}agregar/`,userol,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un use-rol:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   getUsuRol(id:number): Observable<UsuRol>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<UsuRol>(`${this.myAppUrl}${this.myApiUrl}id/${id}`).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para obtener un use-rol:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   updateUsuRol(useRol:UsuRol): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}editar/${useRol.usr_identificaodor}/${useRol.rol_id}`,useRol).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud para actualizar un use-rol:', error);
        return throwError('Error in token: ' + error.message);
      })
    );
    }
  }
}