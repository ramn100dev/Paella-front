import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from '../service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

export interface Schedule{
  id: number;
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
  
  editingCell: { row: Schedule, column: string } | null = null;

  posts:any
  client: any

  constructor(private service: ScheduleService, private route: ActivatedRoute) {
    
    this.client = history.state.client

    this.service.getSchedule(this.route.snapshot.paramMap.get('id') || '1').subscribe( data => {
      console.log(data)
      this.posts = [data]

      this.dataSource = new MatTableDataSource(this.posts)
    })
  }

  isEditing(row: Schedule, column: string): boolean {
    return this.editingCell?.row === row && this.editingCell?.column === column;
  }

  editCell(row: Schedule, column: string): void {
    this.editingCell = { row, column };
  }

  saveCell(row: Schedule, column: string): void {
    this.editingCell = null;
    this.service.updateSchedule(row.id, row).subscribe();
  }
}
