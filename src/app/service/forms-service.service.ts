import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormsServiceService {

  pedidos: any[] = []

  private BASE_URL = "http://localhost:8080/api/sheet/"

  constructor(private http: HttpClient) { }

  getForm(sheetName: string) {
    return this.http.get<any[][]>(`${this.BASE_URL}leer/${sheetName}`);
  }

  deleteRow(sheetName: string, rowIndex: number) {
    return this.http.delete(`${this.BASE_URL}eliminar/${sheetName}/${rowIndex}`);
  }
}
