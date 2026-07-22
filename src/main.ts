import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { CustomRouteReuseStrategy } from './app/custom-route-reuse-strategy';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
}).catch(err => console.error(err));
