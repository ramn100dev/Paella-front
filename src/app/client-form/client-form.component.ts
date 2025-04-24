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
  hasObservation: boolean = false

  constructor(private service: ClientsService, private fb: FormBuilder, private dialogRef: MatDialogRef<ClientFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
    this.isEditMode = data.isEditMode;
    this.isFijo = data.isFijo;

    if(this.isEditMode){
      if(data.client.observation != ""){
        this.hasObservation = true
      } 
    }

    this.clientForm = this.fb.group({
      name: [data.client ? data.client.name : ''],
      address: [data.client ? data.client.address : ''],
      phone: [data.client ? data.client.phone : ''],
      preference: [data.client ? data.client.preference : ''],
      monthly: [data.client ? data.client.monthly : false],
      observation: [data.client ? data.client.observation: '']
    })
  }

  addPreference() {
    this.isFijo = !this.isFijo;

    this.service.getMaxPref().subscribe((data) => {
      this.clientForm.patchValue({ preference: data + 1 })
    })
  }

  manageObservations(){
    this.hasObservation = !this.hasObservation

    if(!this.hasObservation){
      this.clientForm.patchValue({ observation: ''})
    }
  }

  onSubmit() {

    if (!this.isFijo) {
      this.clientForm.patchValue({ preference: 0 }); // Establece preferencia en 0 si no es fijo
    }

    if (this.clientForm.valid) {
      if (this.isEditMode) {
        this.service.updateClient(this.data.client.id, this.clientForm.value).subscribe({
          next: (res) => {
            console.log(res)
            //this.data.client.monthly = res.monthly 
          },
          error: (err) => console.log(err),
        });
      } else {
        this.service.postClient(this.clientForm.value).subscribe({
          next: (res: any) => {
            console.log(res);

            if (this.isFijo && this.clientForm.value.preference > 0) {
              this.service.checkPref(res.id, this.clientForm.value.preference).subscribe({
                next: (updateRes) => console.log(updateRes),
                error: (updateErr) => console.log(updateErr),
              });
            }
          },
          error: (err) => console.log(err),
        });
      }
      //console.log(this.data.client.monthly)
      this.dialogRef.close(this.clientForm.value);
    }
  }
}