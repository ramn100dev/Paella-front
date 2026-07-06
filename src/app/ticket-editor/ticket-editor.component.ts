import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatInput,
    MatButton
  ],
  selector: 'app-ticket-editor',
  templateUrl: './ticket-editor.component.html',
  styleUrls: ['./ticket-editor.component.css']
})
export class TicketEditorComponent {

  multipleSchedule: boolean
  time = ''

  ids: string | null = null
  highlightMode = localStorage.getItem('highlightOption')

  private dialogRef = inject(MatDialogRef<TicketEditorComponent>)
  private router = inject(Router)
  data = inject(MAT_DIALOG_DATA)

  constructor(){
    //console.log(data.dayValue.length + " fasfaf" + data.dayValue)
    this.multipleSchedule = this.data.multipleSchedule

    const storage = this.getStorage();
    if (storage) {
      this.ids = storage.getItem('clientsIds');
    }
  }

  selectFood(food: string){
    if (this.getStorage()) {
      //console.log(this.getStorage())
      this.sessionStoragePref()
    }

    this.router.navigate(['/ticket', this.data.client.id], { state: { client: this.data.client, food, time: this.time, ticketType: 'Menu'}})
    this.dialogRef.close()
  }

  sessionStoragePref(){
    // Obtiene los IDs de clientes almacenados en sessionStorage y los convierte de JSON a un array.
    const clientsIds = this.ids ? JSON.parse(this.ids): []

    if (!clientsIds.includes(this.data.client.id)) {
      clientsIds.push(this.data.client.id);
      // Actualiza sessionStorage con el nuevo array de IDs convertido a JSON.
      this.getStorage()!.setItem('clientsIds', JSON.stringify(clientsIds))
      console.log(clientsIds);
    } else {
      console.log('El ID del cliente ya existe en sessionStorage:', this.data.client.id);
    }
  }

  getStorage() {
    if (this.highlightMode == '1') {
      return sessionStorage;
    } else if (this.highlightMode == '2') {
      return localStorage;
    }
    return null;
  }

  checkDayValue(): boolean{
    return this.data.dayValue.some((value: any) => value !== null);
  }
}
