import { ThisReceiver } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ticket-editor',
  templateUrl: './ticket-editor.component.html',
  styleUrls: ['./ticket-editor.component.css']
})
export class TicketEditorComponent {

  multipleSchedule: boolean
  time = ''

  ids: any
  highlightMode = localStorage.getItem('highlightOption')
  
  constructor(private dialogRef: MatDialogRef<TicketEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){
    console.log(data.dayValue.length + " fasfaf" + data.dayValue)
    this.multipleSchedule = data.multipleSchedule

    const storage = this.getStorage();
    if (storage) {
      this.ids = storage.getItem('clientsIds');
    }
  }

  selectFood(food: string){
    if (this.getStorage()) {
      console.log(this.getStorage())
      this.sessionStoragePref()
    }
    
    this.router.navigate(['/ticket', this.data.client.id], { state: { client: this.data.client, food, time: this.time}})
    this.dialogRef.close()
  }

  sessionStoragePref(){
    // Obtiene los IDs de clientes almacenados en sessionStorage y los convierte de JSON a un array.
    let clientsIds = this.ids ? JSON.parse(this.ids): []
    
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