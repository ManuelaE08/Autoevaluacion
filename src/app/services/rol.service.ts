import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rol } from '../interfaces/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private myAppUrl: string;
  private myApiUrl: string;


  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.apiUrl;
    this.myApiUrl = '/rol/';
  }

  getRoles(): Observable<Rol[]>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<Rol[]>(`${this.myAppUrl}${this.myApiUrl}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un rol:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }
}
