import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from '../service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';



export interface Schedule{
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent {
  client: any
  displayedColumn:string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  dataSource!: MatTableDataSource<Schedule>

  posts:any

  constructor(private service: ScheduleService, private route: ActivatedRoute) {
    this.client = history.state.client
    this.service.getSchedule(this.route.snapshot.paramMap.get('id') || '0').subscribe( data => {
      console.log(data)
      this.posts = data

      this.dataSource = new MatTableDataSource(this.posts)
    })
  }
}
