import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Client } from '../table-clients/table-clients.component';
import { Observable } from 'rxjs';

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
}
