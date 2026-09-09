import { Component, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './service/theme.service';

@Component({
    imports: [RouterOutlet],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  private themeService = inject(ThemeService)

  constructor(renderer: Renderer2) {
    this.themeService.applyTheme(renderer, this.themeService.getStoredTheme())
  }
}
