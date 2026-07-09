import { Routes } from '@angular/router';
import { TableClientsComponent } from './table-clients/table-clients.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';
import { TicketGeneratorComponent } from './ticket-generator/ticket-generator.component';
import { FoodsDragDropComponent } from './foods-drag-drop/foods-drag-drop.component';

export const routes: Routes = [
  { path: 'clients', component: TableClientsComponent },
  { path: 'schedule/:id', component: ScheduleTableComponent },
  { path: 'ticket/:id', component: TicketGeneratorComponent },
  { path: 'test', component: FoodsDragDropComponent },
  { path: '**', redirectTo: 'clients' }
];

//https://ramn100dev.github.io/Paella-front ....
