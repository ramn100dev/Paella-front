import { Component, ViewChild } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';


export interface Client{
  name: string;
  address: string;
  phone: string;
}

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

  constructor(private service: ClientsService, private router: Router, private dialog: MatDialog) {
    this.getClientList()
  }
  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
    
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }


  openClientForm(){
    const dialogRef = this.dialog.open(ClientFormComponent, {
      width: '300px',
    })

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getClientList()
      }
    })
  }


  loadSchedule(client: any){
    this.router.navigate(['/schedule', client.id], { state: { client } })
  }

  getClientList() {
    this.service.getClients().subscribe(data => {
      console.log(data)
      this.posts = data

      this.dataSource = new MatTableDataSource(this.posts)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.paginator._intl.itemsPerPageLabel = "Clientes por pagina"
    })
  }
}
