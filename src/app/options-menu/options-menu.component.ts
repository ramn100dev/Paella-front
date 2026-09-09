import { Component, inject, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioChange, MatRadioGroup } from '@angular/material/radio';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { FoodsDragDropComponent } from '../foods-drag-drop/foods-drag-drop.component';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../service/theme.service';

@Component({
    imports: [
        MatIcon,
        MatRadioGroup,
        MatTab,
        MatTabGroup,
        MatRadioButton,
        FoodsDragDropComponent,
        FormsModule
    ],
    selector: 'app-options-menu',
    templateUrl: './options-menu.component.html',
    styleUrls: ['./options-menu.component.css']
})
export class OptionsMenuComponent {

  highlightMode = localStorage.getItem('highlightOption')
  highlightOption: string = this.highlightMode ? this.highlightMode : '0'

  private dialogRef = inject(MatDialogRef<OptionsMenuComponent>)
  private renderer = inject(Renderer2)
  private themeService = inject(ThemeService)

  // MARCADORES Y GESTION DEL STORAGE
  highlightOptions(event: MatRadioChange) {
    this.highlightOption = event.value;
    console.log('Opción seleccionada:', this.highlightOption)
    localStorage.setItem('highlightOption', this.highlightOption)

    switch(this.highlightOption) {
      case '0':
        localStorage.removeItem('clientsIds')
        sessionStorage.removeItem('clientsIds')
        break;
      case '1':
        localStorage.removeItem('clientsIds')
        break;
      case '2':
        sessionStorage.removeItem('clientsIds')
        break;
      default:
        console.log('Opción no reconocida')
    }
  }

  deleteLocalStorage() {
    localStorage.removeItem('clientsIds')
  }


  //PERSONALIZACION
  themes = this.themeService.themes

  changeButton(themeName: string) {
    this.themeService.setTheme(this.renderer, themeName)
  }

  //CLOSE
  closeDialog() {
    this.dialogRef.close();
  }
}
