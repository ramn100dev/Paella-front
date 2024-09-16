import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from '../service/clients.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {

  clientForm: FormGroup
  isEditMode: boolean;

  constructor(private service: ClientsService, private fb: FormBuilder, private dialogRef: MatDialogRef<ClientFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

    this.isEditMode = data.isEditMode;

    this.clientForm = this.fb.group({
      name: [data.client ? data.client.name : ''],
      address: [data.client ? data.client.address : ''],
      phone: [data.client ? data.client.phone : '']
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (this.isEditMode) {
        this.service.updateClient(this.data.client.id, this.clientForm.value).subscribe({
          next: res => console.log(res),
          error: err => console.log(err)
        });
      } else {
        this.service.postClient(this.clientForm.value).subscribe({
          next: res => console.log(res),
          error: err => console.log(err)
        });
      }
      this.dialogRef.close(this.clientForm.value);
    }
  }
}