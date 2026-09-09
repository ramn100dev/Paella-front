import { Injectable, Renderer2 } from '@angular/core';

export interface Theme {
  name: string;
  colors: { primary: string; accent: string; warn: string };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  readonly themes: Theme[] = [
    { name: 'default', colors: { primary: '#757575', accent: '#BDBDBD', warn: '#FAFAFA' } },
    { name: 'pink', colors: { primary: '#D81B60', accent: '#FF80AB', warn: '#FCE4EC' } },
    { name: 'red', colors: { primary: '#F44336', accent: '#FF5252', warn: '#FFEBEE' } },
    { name: 'orange', colors: { primary: '#FB8C00', accent: '#FFD740', warn: '#FFF3E0' } },
    { name: 'blue', colors: { primary: '#1E88E5', accent: '#448AFF', warn: '#E3F2FD' } },
    { name: 'cyan', colors: { primary: '#00ACC1', accent: '#00E5FF', warn: '#E0F7FA' } },
    { name: 'light-green', colors: { primary: '#7CB342', accent: '#B2FF59', warn: '#F1F8E9' } },
  ]

  getStoredTheme(): string {
    return localStorage.getItem('theme') || 'default'
  }

  //Aplica el tema al DOM (clases del body + variables CSS), sin tocar el localStorage
  applyTheme(renderer: Renderer2, themeName: string): void {
    const theme = this.themes.find(t => t.name === themeName)
    if (!theme) {
      return
    }

    this.themes.forEach(t => renderer.removeClass(document.body, t.name))
    renderer.addClass(document.body, themeName)
    renderer.setStyle(document.body, 'background-color', theme.colors.warn)
    document.documentElement.style.setProperty('--accent-color', theme.colors.accent)
    document.documentElement.style.setProperty('--warn-color', theme.colors.warn)
    document.documentElement.style.setProperty('--primary-color', theme.colors.primary)
  }

  //Aplica el tema y lo deja guardado como preferencia del usuario
  setTheme(renderer: Renderer2, themeName: string): void {
    this.applyTheme(renderer, themeName)

    const theme = this.themes.find(t => t.name === themeName)
    if (theme) {
      localStorage.setItem('background-color', theme.colors.warn)
    }
    localStorage.setItem('theme', themeName)
  }
}
