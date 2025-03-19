import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Client } from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  
  private BASE_URL = "http://localhost:8080/api/client"

  constructor(private http: HttpClient) { }

  getClients() {
    return this.http.get(this.BASE_URL + "/all")
  }

  postClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.BASE_URL + "/new", client)
  }

  updateClient(id:number, client: Client): Observable<Client> {
    return this.http.put<Client>(this.BASE_URL + "/modify/" + id, client)
  }

  getClientsPref() {
    return this.http.get(this.BASE_URL + "/preference")
  }

  checkPref(id: number, preference: number){
    return this.http.put(this.BASE_URL + "/checkPreference/" + id + "/" + preference, {})
  }

  getMaxPref(){
    return this.http.get<number>(this.BASE_URL + "/getMaxPref")
  }
}
