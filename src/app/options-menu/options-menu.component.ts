import { Component, Inject, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-options-menu',
  templateUrl: './options-menu.component.html',
  styleUrls: ['./options-menu.component.css']
})
export class OptionsMenuComponent {

  highlightMode = localStorage.getItem('highlightOption')
  highlightOption: string = this.highlightMode ? this.highlightMode : '0'


  constructor(private dialogRef: MatDialogRef<OptionsMenuComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private renderer: Renderer2) {
    
  }

  // MARCADORES Y GESTION DEL STORAGE
  highlightOptions(event: any) {
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
  themes = [
    { name: 'default', colors: { primary: '#757575', accent: '#BDBDBD', warn: '#FAFAFA' } },
    { name: 'pink', colors: { primary: '#D81B60', accent: '#FF80AB', warn: '#FCE4EC' } },
    { name: 'red', colors: { primary: '#F44336', accent: '#FF5252', warn: '#FFEBEE' } },
    { name: 'orange', colors: { primary: '#FB8C00', accent: '#FFD740', warn: '#FFF3E0' } },
    { name: 'blue', colors: { primary: '#1E88E5', accent: '#448AFF', warn: '#E3F2FD' } },
    { name: 'cyan', colors: { primary: '#00ACC1', accent: '#00E5FF', warn: '#E0F7FA' } },
    { name: 'light-green', colors: { primary: '#7CB342', accent: '#B2FF59', warn: '#F1F8E9' } },
  ]

  currentTheme = localStorage.getItem('theme') || ("default")

  changeButton(themeName:string) {
    const selectedTheme = this.themes.find(t => t.name === themeName)

    this.themes.forEach(t => this.renderer.removeClass(document.body, t.name))

    if (selectedTheme) {
      this.renderer.addClass(document.body, themeName);
  
      this.renderer.setStyle(document.body, 'background-color', selectedTheme.colors.warn);
      localStorage.setItem('background-color', selectedTheme.colors.warn)
      document.documentElement.style.setProperty('--accent-color', selectedTheme.colors.accent);
      document.documentElement.style.setProperty('--warn-color', selectedTheme.colors.warn);
      document.documentElement.style.setProperty('--primary-color', selectedTheme.colors.primary);
    }

    this.currentTheme = themeName;
    localStorage.setItem('theme', themeName);
    
  }



  //CLOSE
  closeDialog() {
    this.dialogRef.close();
  }
}
