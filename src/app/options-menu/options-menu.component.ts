import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-options-menu',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css']
})
export class OptionsMenuComponent {

  highlightMode = localStorage.getItem('highlightOption')
  highlightOption: string = this.highlightMode ? this.highlightMode : '0'

  constructor(private dialogRef: MatDialogRef<OptionsMenuComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {}

  highlightOptions(event: any) {
    this.highlightOption = event.value;
    console.log('Opción seleccionada:', this.highlightOption);
    localStorage.setItem('highlightOption', this.highlightOption);

    switch(this.highlightOption) {
      case '0':
        localStorage.removeItem('clientsIds');
        sessionStorage.removeItem('clientsIds');
        break;
      case '1':
        localStorage.removeItem('clientsIds');
        break;
      case '2':
        sessionStorage.removeItem('clientsIds');
        break;
      default:
        console.log('Opción no reconocida');
    }
  }

  deleteLocalStorage() {
    localStorage.removeItem('clientsIds');
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
