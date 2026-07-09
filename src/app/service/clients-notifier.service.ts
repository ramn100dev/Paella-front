import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsNotifierService {

  private clientsChanged$ = new Subject<void>();
  clientsChanged = this.clientsChanged$.asObservable();

  notifyClientsChanged() {
    this.clientsChanged$.next();
  }
}
