import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from '../service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

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
  displayedColumns: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  dataSource!: MatTableDataSource<Schedule>

  posts:any
  client: any

  constructor(private service: ScheduleService, private route: ActivatedRoute) {
    
    this.service.getSchedule(this.route.snapshot.paramMap.get('id') || '1').subscribe( data => {
      console.log(data)
      this.posts = [data]

      this.dataSource = new MatTableDataSource(this.posts)
    })
    
    this.client = history.state.client
  }
}
