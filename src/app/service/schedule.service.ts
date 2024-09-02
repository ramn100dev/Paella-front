import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private BASE_URL = "http://localhost:8080/api/schedule"

  constructor(private http: HttpClient) { }

  getSchedule(id: string) {
    return this.http.get(this.BASE_URL + "/by-id" + "/" + id)
  }
}
