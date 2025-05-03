import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'paella-front';

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
  
  constructor(renderer: Renderer2)  {
    const savedTheme = this.themes.find(t => t.name === this.currentTheme);

    if (savedTheme) {
      renderer.addClass(document.body, this.currentTheme);
      renderer.setStyle(document.body, 'background-color', savedTheme.colors.warn);
      document.documentElement.style.setProperty('--accent-color', savedTheme.colors.accent);
      document.documentElement.style.setProperty('--warn-color', savedTheme.colors.warn);
      document.documentElement.style.setProperty('--primary-color', savedTheme.colors.primary);
    }
  }
}
