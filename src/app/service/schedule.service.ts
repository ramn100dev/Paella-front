import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Schedule } from '../schedule-table/schedule-table.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private BASE_URL = "https://cateringestor.onrender.com/api/schedule"

  constructor(private http: HttpClient) { }

  /*getSchedule(id: string) {
    return this.http.get(this.BASE_URL + "/by-id/" +  + id)
  }*/

  getScheduleList(id: string) {
    return this.http.get<Schedule[]>(this.BASE_URL + "/" + id + "/client")
  }

  updateSchedule(id: number, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(this.BASE_URL + "/modify/" + id, schedule)
  }

  delete(id: number){
    return this.http.delete(this.BASE_URL + "/delete/" + id)
  }

  addSchedule(id: number){
    return this.http.post<Schedule>(this.BASE_URL + "/new/" + id, {})
  }

  deleteSchedule(id: number){
    return this.http.delete(this.BASE_URL + "/deleteSchedule/" + id)
  }
}
