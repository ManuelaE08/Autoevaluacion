import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Labor } from '../interfaces/labor';

@Injectable({
  providedIn: 'root'
})
export class LaborService {

  private myAppUrl: string;
  private myApiUrl: string;
  private deleteLab: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.apiUrl;
    this.myApiUrl = '/labor/';
    this.deleteLab = 'eliminar/';
   }

   getListLabores(): Observable<Labor[]>{
    //return this.http.get<Labor[]>(`${this.myAppUrl}${this.myApiUrl}`);

    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get<Labor[]>(`${this.myAppUrl}${this.myApiUrl}`,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   deleteLabor(id: number): Observable<void>{
    console.log(`${this.myAppUrl}${this.myApiUrl}${this.deleteLab}${id}`);
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${this.deleteLab}${id}`);
   }

   saveLabor(labor: Labor): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}agregar`,labor,{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   saveItem(idUser: number, idLab:number): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      return throwError('Token not provided!');
    }else{
      const headers = new HttpHeaders({ Authorization: token });  
      return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}agregarItem`,{idUser,idLab},{headers}).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
   }

   getLabor(id:number): Observable<Labor>{
    return this.http.get<Labor>(`${this.myAppUrl}${this.myApiUrl}id/${id}`);
   }

   updateLabor(labor:Labor): Observable<void>{
    console.log('update',labor);
    return this.http.put<void>(`${this.myAppUrl}${this.myApiUrl}editar/${labor.id}`,labor);
   }
}
