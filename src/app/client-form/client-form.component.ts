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
  isEditMode: boolean
  isFijo: boolean

  constructor(private service: ClientsService, private fb: FormBuilder, private dialogRef: MatDialogRef<ClientFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any){

    this.isEditMode = data.isEditMode
    this.isFijo = data.isFijo

    this.clientForm = this.fb.group({
      
      name: [data.client ? data.client.name : ''],
      address: [data.client ? data.client.address : ''],
      phone: [data.client ? data.client.phone : ''],
      preference: [data.client ? data.client.preference: '']
    });
  }

  addPreference() {
    this.isFijo = !this.isFijo

    this.service.getMaxPref().subscribe( data => {
      this.clientForm.patchValue({ preference: data + 1 })
    })
  }

  onSubmit() {
    if (!this.isFijo) {
      this.clientForm.value.preference = 0 // Asignar 0 si el cliente no es fijo
    }
  
    if (this.clientForm.valid) {
      if (this.isEditMode) {
        console.log(this.clientForm.value.preference)
        this.service.updateClient(this.data.client.id, this.clientForm.value).subscribe({
          next: res => console.log(res),
          error: err => console.log(err)
        })
      } else {
        this.service.postClient(this.clientForm.value).subscribe({
          next: (res: any) => {
            console.log(res)
            // Verificar si el cliente es fijo y tiene preferencia > 0
            if (this.isFijo && this.clientForm.value.preference > 0) {
              this.service.checkPref(res.id, this.clientForm.value.preference).subscribe({
                next: updateRes => console.log(updateRes),
                error: updateErr => console.log(updateErr)
              })
            }
          },
          error: err => console.log(err)
        })
      }
      this.dialogRef.close(this.clientForm.value)
    }
  }
}