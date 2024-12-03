import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from 'src/app/service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../table-clients/table-clients.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
import { TicketEditorComponent } from '../ticket-editor/ticket-editor.component';

export interface Schedule{
  id: number;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
  client_id: number;
}

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent {
  displayedColumns: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
  dataSource!: MatTableDataSource<Schedule>
  
  editingCell: { row: Schedule, column: string } | null = null

  posts:any
  client: any
  multipleSchedule: boolean = false
  deleteMode: boolean = false

  constructor(private service: ScheduleService, private router: Router, private dialog: MatDialog) {

    this.client = history.state.client
    
    this.getScheduleList()
  }

  openClientEdit() {
    const isFijo = this.client.preference !== 0

    const dialogRef = this.dialog.open(ClientFormComponent, {
      data: { isEditMode: true, client: this.client, isFijo: isFijo },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
        this.client.name = result.name
        this.client.address = result.address
        this.client.phone = result.phone
        this.client.preference = result.preference
      }
    });
}

  createTicket(day: string){
    const dayValue = []
    const food = this.posts[0]

    if(this.multipleSchedule){
      for (let i = 0; i < food.length; i++) {
        dayValue.push(food[i][day])
      }
    } else{
      dayValue.push(food[0][day])
    }

    const dialogRef = this.dialog.open(TicketEditorComponent, {
      data: { client: this.client, dayValue: dayValue, multipleSchedule: this.multipleSchedule },
      width: '300px'
    });

    dialogRef.afterClosed().subscribe( result => {
      if (result) {
        console.log(result)
      }
    })
  }

  addSchedule(){
    this.service.addSchedule(this.client.id).subscribe()
    this.getScheduleList()
  }

  activateDelete(){
    this.deleteMode = !this.deleteMode
    if(this.deleteMode){
      this.displayedColumns.push('delete')
    } else {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'delete');
    }
  }

  deleteSchedule(row: Schedule){
    this.service.deleteSchedule(row.id).subscribe({
      next: () => {
        this.getScheduleList()
      }
    })
  }

  getScheduleList(){
    this.service.getScheduleList(this.client.id).subscribe( data => {
      
      this.posts = [data];
      this.dataSource = new MatTableDataSource(data)

      if([data][0].length > 1){
        this.multipleSchedule = true
        
      } else {
        this.multipleSchedule = false
        this.deleteMode = false
        this.displayedColumns = this.displayedColumns.filter(column => column !== 'delete')
      }
    })
  }

  delete(){
    this.service.delete(this.client.id).subscribe()
    this.router.navigate(['/clients'])
  }

  /* EXPLICACIÓN A LA LOGICA DE LA EDICIÓN DE CELDAS
      Sin duda este es el codigo mas complejo de la aplicación, y quiero dedicarle una explcicación, vaya a ser que mi yo del futuro se quiera cambiarlo y me vuelva loco

      Basicamente, en el HTML utilizamos un *ngIf para usar el div o el input segun la variable 'editingCell',
      a partir de aqui estan las funciones
  */ 

  //Verifica si la celda se esta editando:
  //Basicamente, se compara si la celda selecciona esta en modo edición, comparando los valores row y column, para pasar a editCell()
  isEditing(row: Schedule, column: string): boolean {
    return this.editingCell?.row === row && this.editingCell?.column === column
  }

  //Activa el input
  editCell(row: Schedule, column: string): void {
    this.editingCell = { row, column }
  }

  //Guarda los cambios, y hace que la celda no se este editando mas
  saveCell(row: Schedule, column: string): void {
    this.editingCell = null;
    this.service.updateSchedule(row.id, row).subscribe()
  }
}
