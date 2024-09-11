import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from '../service/clients.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {

  clientForm: FormGroup

  constructor(private service: ClientsService, private fb: FormBuilder, private dialogRef: MatDialogRef<ClientFormComponent>){
    this.clientForm = this.fb.group({
      name: '',
      address: '',
      phone: ''
    })
  }

  onSubmit(){
    if(this.clientForm.valid){
      this.service.postClient(this.clientForm.value).subscribe({

        next: res => console.log(res),

        error: err => console.log(err)
      })

      this.dialogRef.close(this.clientForm.value)
    }
  }
}
