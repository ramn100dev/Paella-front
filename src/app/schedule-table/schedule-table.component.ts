import { Component, ViewChild } from '@angular/core';
import { ScheduleService } from 'src/app/service/schedule.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
import { TicketEditorComponent } from '../ticket-editor/ticket-editor.component';
import { MatDrawer } from '@angular/material/sidenav';
import { Schedule } from '../models/Schedule';




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
  multipleSchedule: boolean = false
  deleteMode: boolean = false
  isMonthly: boolean = false
  monthView: (number | null)[][] = []

  constructor(private service: ScheduleService, private router: Router, private dialog: MatDialog) {
    
    this.client = history.state.client
    
    const today = new Date();
    this.monthView = this.generateMonthView(today.getMonth(), today.getFullYear());
    
    this.getScheduleList()
  }

  getScheduleList(){
    this.service.getScheduleList(this.client.id).subscribe(data => {
      this.posts = [data];
      this.dataSource = new MatTableDataSource(data);
  
      if (data.length > 1){
        this.multipleSchedule = true;
      } else {
        this.multipleSchedule = false;
        this.deleteMode = false;
        this.displayedColumns = this.displayedColumns.filter(column => column !== 'delete');
      }
  
      if (this.client.monthly != 0) {
        this.isMonthly = true;
      } 
      console.log(data)
    });
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
        this.client.name = result.name;
        this.client.address = result.address;
        this.client.phone = result.phone;
        this.client.preference = result.preference;
        this.client.monthly = result.monthly;
      
        this.isMonthly = result.monthly
        this.monthlyErrorProof()
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
      minWidth: '300px'
    });
  }

  addSchedule(){
    this.service.addSchedule(this.client.id).subscribe({
      next: (res) => {
        this.getScheduleList();
      }
    });
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
    console.log(row)
    this.service.deleteSchedule(row.id).subscribe({
      next: () => {
        this.getScheduleList()
      }
    })
  }

  //Borrar cliente
  delete(){
    this.service.delete(this.client.id).subscribe()
    this.router.navigate(['/clients'])
  }



  /* EXPLICACIÓN A LA LOGICA DE LA EDICIÓN DE CELDAS
      En el HTML utilizamos un *ngIf para usar el div o el input segun la variable 'editingCell',
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
    this.editingCell = null
    this.service.updateSchedule(row.id, row).subscribe()
  }

  
  /*
      LOGICA DEL HORARIO MENSUAL
  */

  generateMonthView(month: number, year: number): (number | null)[][] {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let firstDayOfMonth = new Date(year, month, 1).getDay()
    if (firstDayOfMonth === 0) {
      firstDayOfMonth = 6 // Convertir domingo a posición 6
    } else {
      firstDayOfMonth -= 1 // Desplazar días una posición para que lunes sea el primer día
    }
  
    const monthView: (number | null)[][] = []
    let week: (number | null)[] = new Array(7).fill(null)
    let day = 1
  
    // Llena la primera semana con null hasta el primer día del mes
    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null
    }
  
    // Llena la primera semana con los días iniciales del mes
    for (let i = firstDayOfMonth; i < 7; i++) {
      if (day <= daysInMonth) {
        week[i] = day++
      }
    }
    monthView.push(week);
  
    // Llena las semanas subsiguientes
    while (day <= daysInMonth) {
      week = new Array(7).fill(null)
      for (let i = 0; i < 7; i++) {
        if (day <= daysInMonth) {
          week[i] = day++
        }
      }
      monthView.push(week)
    }
  
    return monthView;
  }
  
  getDayOfMonth(row: Schedule, column: string): number | null {
    const rowIndex = this.dataSource.data.indexOf(row)
    const columnIndex = this.getColumnIndex(column)
    return this.monthView[rowIndex] ? this.monthView[rowIndex][columnIndex] : null
  }

  getColumnIndex(column: string): number {
    switch (column) {
      case 'lunes': return 0
      case 'martes': return 1
      case 'miercoles': return 2
      case 'jueves': return 3
      case 'viernes': return 4
      case 'sabado': return 5
      case 'domingo': return 6
      default: return -1
    }
  }

  monthlyErrorProof(){
    console.log(this.posts[0].length)
    if(this.isMonthly && this.posts[0].length <= 5){
      for (let i = this.posts[0].length - 1; i < 5; i++){
        this.addSchedule()
      }
    } else {
      if(this.isMonthly && this.posts[0].length > 6){
        window.alert("Para cambiar a horario mensual se eliminaran las ultimas " + (this.posts[0].length - 6) + " filas")
        for (let i = this.posts[0].length - 1; i > 5; i--){
          this.deleteSchedule(this.posts[0][i])
        }
      }
    }
  }


  /* 
      LOGICA PARA LA TABLA COMIDAS ARRASTRABLES 
  */

  @ViewChild('drawer') drawer!: MatDrawer
  
  toggleFoodTableState = false

  dragActivated = false
  draggedFood: string | null = null
  heightToggle: number = 100;

  // Alternar el Drawer (Abrir/Cerrar)
  toggleFoodTable() {
    this.toggleFoodTableState = !this.toggleFoodTableState;
    console.log(this.heightToggle)
    document.documentElement.style.setProperty('--drawer-height', `${this.heightToggle}px`)
    if (this.toggleFoodTableState) {
      this.drawer.open(); // Abre el drawer
    } else {
      this.drawer.close(); // Cierra el drawer
    }
  }

  foodGet(food: string) {
    this.dragActivated = !this.dragActivated
    this.draggedFood = food
  }

  // Registrar la comida al soltar sobre una celda. Esto funciona gracias a que (mouseup) se activa al dejar de mantener el click, registrando la comida y el estado del drag
  onDropCell(column: string, row: any) {
    if (this.dragActivated && this.draggedFood) {
      console.log(`Comida soltada: ${this.draggedFood} en columna: ${column}`);
      if (row[column]) {
        row[column] += `, ${this.draggedFood}`; // Añadir al contenido existente
      } else {
        row[column] = this.draggedFood; // Asignar si está vacío
      }
      this.saveCell(row, column)
    }
  }
}