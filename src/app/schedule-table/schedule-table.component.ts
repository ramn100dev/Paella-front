import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from 'src/app/service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../table-clients/table-clients.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';

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

  constructor(private service: ScheduleService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    
    this.client = history.state.client

    this.service.getSchedule(this.route.snapshot.paramMap.get('id') || '1').subscribe( data => {
      //console.log(data)
      this.posts = [data]

      this.dataSource = new MatTableDataSource(this.posts)
      //console.log(this.dataSource)
    })
  }

  openClientEdit(){
    const dialogRef = this.dialog.open(ClientFormComponent, {
      data: { isEditMode: true, client: this.client },
      width: '300px'
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result)
        this.client.name = result.name
        this.client.address = result.address
        this.client.phone = result.phone
      }
    })
  }

  createTicket(day: string){
    const client:Client = this.client
    const food = this.posts[0][day]
    //console.log(client)
    this.router.navigate(['/ticket', this.client.id], { state: { client, food }})
  }

  /* EXPLICACIÓN A LA LOGICA DE LA EDICIÓN DE CELDAS
      Sin duda este es el codigo mas complejo de la aplicación, y quiero dedicarle una explcicación, vaya a ser que mi yo del futuro se quiera cambiarlo y me quiera pegar un tiro 

      Basicamente, en el HTML utilizamos un *ngIf para usar el div o el input segun la variable 'editingCell',
      a partir de aqui estan las funciones
  */ 

  //Verifica si la celda se esta editando:
  //Basicamente, se compara si la celda selecciona esta en modo edición, comparando los valores row y column, para pasar a editCell()
  isEditing(row: Schedule, column: string): boolean {
    return this.editingCell?.row === row && this.editingCell?.column === column;
  }

  //Activa el input
  editCell(row: Schedule, column: string): void {
    this.editingCell = { row, column };
  }

  //Guarda los cambios, y hace que la celda no se este editando mas
  saveCell(row: Schedule, column: string): void {
    this.editingCell = null;
    this.service.updateSchedule(row.id, row).subscribe();
  }

  
}
