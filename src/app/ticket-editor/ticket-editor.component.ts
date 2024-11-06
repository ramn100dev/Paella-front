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

  constructor(private dialogRef: MatDialogRef<TicketEditorComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router){

    this.multipleSchedule = data.multipleSchedule
    console.log(data.dayValue)
  }

  selectFood(food: string){
    console.log(food)

    this.router.navigate(['/ticket', this.data.client.id], { state: { client: this.data.client, food, time: this.time}})
    this.dialogRef.close()
  }
}
