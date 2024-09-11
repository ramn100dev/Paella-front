import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableClientsComponent } from './table-clients/table-clients.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';

import { HttpClientModule } from '@angular/common/http'
import { MatTableModule} from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatSortModule } from '@angular/material/sort'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TicketGeneratorComponent } from './ticket-generator/ticket-generator.component'


@NgModule({
  declarations: [
    AppComponent,
    TableClientsComponent,
    ScheduleTableComponent,
    ClientFormComponent,
    TicketGeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
