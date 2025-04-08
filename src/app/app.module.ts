import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableClientsComponent } from './table-clients/table-clients.component';
import { ClientFormComponent } from './client-form/client-form.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';
import { TicketGeneratorComponent } from './ticket-generator/ticket-generator.component';
import { TicketEditorComponent } from './ticket-editor/ticket-editor.component';

//Angular
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Material
import { MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OptionsMenuComponent } from './options-menu/options-menu.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FoodsDragDropComponent } from './foods-drag-drop/foods-drag-drop.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    TableClientsComponent,
    ScheduleTableComponent,
    ClientFormComponent,
    TicketGeneratorComponent,
    TicketEditorComponent,
    OptionsMenuComponent,
    FoodsDragDropComponent
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
    MatDialogModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    DragDropModule,
    MatSidenavModule,
    MatButtonModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
