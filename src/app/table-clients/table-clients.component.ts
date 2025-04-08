import { Component, ViewChild } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { Client } from '../models/Client';



@Component({
  selector: 'app-table-clients',
  templateUrl: './table-clients.component.html',
  styleUrls: ['./table-clients.component.css'],
})
export class TableClientsComponent {
  displayedColumn:string[] = ['name', 'address', 'phone']
  dataSource!: MatTableDataSource<Client>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  posts:any
  prefPosts:any
  showPref = false
  highlightMode = localStorage.getItem('highlightOption')

  constructor(private service: ClientsService, private router: Router, private dialog: MatDialog) {
    this.getClientList()

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.getClientList()
      }
    })
  }

  getClientList() {
    this.service.getClients().subscribe(data => {
      this.posts = data

      this.dataSource = new MatTableDataSource(this.posts)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.paginator._intl.itemsPerPageLabel = "Clientes por pagina"
    })
  }

  loadSchedule(client: any){
    this.router.navigate(['/schedule', client.id], { state: { client } })
  }

  openClientForm(){
    const dialogRef = this.dialog.open(ClientFormComponent, {
      data: { isEditMode: false },
      width: '300px',
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getClientList()
      }
    })
  }

  openOptions(){
    const dialogRef = this.dialog.open(OptionsMenuComponent, {
      width: '80%',
      height: '80%'
    })
  }

  getPreferenceClientList() {
    this.service.getClientsPref().subscribe((data) => {
      this.prefPosts = data;
      if (this.showPref) {
        this.dataSource = new MatTableDataSource(this.prefPosts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  toggleClientList() {
    this.showPref = !this.showPref;

    if (this.showPref) {
      this.getPreferenceClientList(); // Cargar la lista alternativa
    } else {
      this.getClientList(); // Volver a la lista principal
    }
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
    
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  
  //sessionStorageHighlight
  isClientHighlighted(clientId: string): boolean {
    const storage = this.getStorage();
  
    // Verifica si `storage` no es nulo antes de continuar.
    if (!storage) {
      return false;
    }
  
    const storedIds = JSON.parse(storage.getItem('clientsIds') || '[]');
    return storedIds.includes(clientId);
  }
  

  getStorage() {
    if (this.highlightMode == '1') {
      return sessionStorage;
    } else if (this.highlightMode == '2') {
      return localStorage;
    }
    return null;
  }
}
