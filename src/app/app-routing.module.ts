import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableClientsComponent } from './table-clients/table-clients.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';

const routes: Routes = [
  {path: 'clients', component:TableClientsComponent},
  {path: 'schedule/:id', component:ScheduleTableComponent},
  {path: '**', redirectTo: 'clients'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//https://ramn100dev.github.io/Paella-front