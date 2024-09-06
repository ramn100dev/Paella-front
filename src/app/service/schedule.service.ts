import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Schedule } from '../schedule-table/schedule-table.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private BASE_URL = "http://localhost:8080/api/schedule"

  constructor(private http: HttpClient) { }

  getSchedule(id: string) {
    return this.http.get(this.BASE_URL + "/by-id/" +  + id)
  }

  updateSchedule(id: number, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(this.BASE_URL + "/modify/" + id, schedule)
  }
}
