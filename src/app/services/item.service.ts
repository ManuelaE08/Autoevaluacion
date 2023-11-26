// Archivo: item.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:3000/autoevaluacion';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(API_URL);
  }

  getItemsAutoevaluacion(usr_identificacion: number): Observable<any> {
    console.log(`Solicitud para obtener items de autoevaluación del usuario ID ${usr_identificacion}`);

    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get(`${API_URL}/${usr_identificacion}`, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para obtener items de autoevaluación:', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Token not provided!');
      return throwError('Token not provided!');
    }
  }

  getItem(uid: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({ Authorization: token });

      return this.http.get(`${API_URL}/detalle/${uid}`, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para obtener un ítem:', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Token not provided!');
      return throwError('Token not provided!');
    }
  }

  addItem(item: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not provided!');
    } else {
      const headers = new HttpHeaders({ Authorization: token });

      return this.http.post(`${API_URL}/add`, item, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para agregar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
  }

  editItem(id: number, item: any): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not provided!');
    } else {
      const headers = new HttpHeaders({ Authorization: token });

      return this.http.put(`${API_URL}/editar/${id}`, item, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para editar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
  }

  deleteItem(id: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError('Token not provided!');
    } else {
      const headers = new HttpHeaders({ Authorization: token });

      return this.http.delete(`${API_URL}/eliminar/${id}`, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para eliminar un ítem:', error);
          return throwError('Error in token: ' + error.message);
        })
      );
    }
  }

  // Manejo de evidencias
  subirEvidencia(usr_identificacion: number, ieva_id: number, archivo: File): Observable<any> {
    const token = localStorage.getItem('token');

    if (token) {
      const formData = new FormData();
      formData.append('archivo', archivo);

      const headers = new HttpHeaders({ Authorization: token });

      return this.http.post(`${API_URL}/${usr_identificacion}/evidencias/subir/${ieva_id}`, formData, { headers }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para subir una evidencia:', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Token not provided!');
      return throwError('Token not provided!');
    }
  }

  descargarEvidencia(usr_identificacion: number, ieva_id: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    if (token) {
      const headers = new HttpHeaders({ Authorization: token });
      return this.http.get(`${API_URL}/${usr_identificacion}/evidencias/descargar/${ieva_id}`, {
        headers,
        responseType: 'blob',
      }).pipe(
        catchError((error: any) => {
          console.error('Error en la solicitud para descargar una evidencia:', error);
          return throwError(error);
        })
      );
    } else {
      console.error('Token not provided!');
      return throwError('Token not provided!');
    }
  }


}
