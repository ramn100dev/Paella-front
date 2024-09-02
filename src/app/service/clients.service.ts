import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private BASE_URL = "http://localhost:8080/api/client"

  constructor(private http: HttpClient) { }

  getClients() {
    return this.http.get(this.BASE_URL + "/all")
  }
}
