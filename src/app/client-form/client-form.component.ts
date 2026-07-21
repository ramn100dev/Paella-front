import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from '../service/clients.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { ClientsNotifierService } from '../service/clients-notifier.service';

@Component({
    imports: [
        MatFormField,
        MatInput,
        MatCheckbox,
        MatButton,
        MatLabel,
        ReactiveFormsModule
    ],
    selector: 'app-client-form',
    templateUrl: './client-form.component.html',
    styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {

  clientForm: FormGroup
  isEditMode: boolean
  isFijo: boolean
  hasObservation: boolean = false

  private service = inject(ClientsService)
  private notifier = inject(ClientsNotifierService)
  private fb =  inject(FormBuilder)
  private dialogRef = inject(MatDialogRef<ClientFormComponent>)
  data = inject(MAT_DIALOG_DATA)

  constructor() {
    
    this.isEditMode = this.data.isEditMode;
    this.isFijo = this.data.isFijo;

    if(this.isEditMode){
      if(this.data.client.observation != ""){
        this.hasObservation = true
      } 
    }

    this.clientForm = this.fb.group({
      name: [this.data.client ? this.data.client.name : ''],
      address: [this.data.client ? this.data.client.address : ''],
      phone: [this.data.client ? this.data.client.phone : ''],
      preference: [this.data.client ? this.data.client.preference : ''],
      monthly: [this.data.client ? this.data.client.monthly : false],
      observation: [this.data.client ? this.data.client.observation: '']
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
            this.notifier.notifyClientsChanged()
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
                next: (updateRes) => {
                  console.log(updateRes)
                  this.notifier.notifyClientsChanged()
                },
                error: (updateErr) => console.log(updateErr),
              });
            } else {
              this.notifier.notifyClientsChanged()
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