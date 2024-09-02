import { Component, ViewChild } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';


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

  constructor(private service: ClientsService, private router: Router) {
    this.service.getClients().subscribe(data => {
      console.log(data)
      this.posts = data

      this.dataSource = new MatTableDataSource(this.posts)
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.paginator._intl.itemsPerPageLabel = "Clientes por pagina"
    })
  }
  
  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
    
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  loadSchedule(client: any){
    this.router.navigate(['/schedule', client.id], { state: { client } })
  }
}
