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
import { MatDrawer } from '@angular/material/sidenav';
import { CategoriesService } from '../service/categories.service';
import { MatCheckboxChange } from '@angular/material/checkbox';



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

  posts: Client[] = []
  highlightMode = localStorage.getItem('highlightOption')

  constructor(private service: ClientsService, private categoriesService: CategoriesService, private router: Router, private dialog: MatDialog) {
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
      //console.log(data)

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

  //sessionStorageHighlight
  isClientHighlighted(clientId: string): boolean {
    const storage = this.getStorage()
  
    if (!storage) {
      return false
    }
  
    const storedIds = JSON.parse(storage.getItem('clientsIds') || '[]')
    return storedIds.includes(clientId)
  }
  
  getStorage() {
    if (this.highlightMode == '1') {
      return sessionStorage;
    } else if (this.highlightMode == '2') {
      return localStorage;
    }
    return null
  }


  //SideNav y Foods Filter
  @ViewChild('drawer') drawer!: MatDrawer
  isDrawerOpen = false
  days: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  categories: any
  subcategories: any
  foods: any
  
  searchValue = ""
  prefFilter = false
  selectByDay = false
  isCategorySelected = false
  isSubCategorySelected = false
  
  activeFilters: any[][] = []
  filteredClients: any[] = []
  selectByDayFilter: any[] | null = null
  selectByFoodFilter: any[] | null = null

  day = null
  food = null
  category = null
  subCategory = null
  selectedByFoodAndDayFilter: any[] | null = null

  toggleDrawer(){
    this.isDrawerOpen = !this.isDrawerOpen
    this.drawer.toggle()

    this.categoriesService.getCategories().subscribe(data => {
      this.categories = data
    })
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value
    this.searchValue = filterValue
    this.dataSource.filter = filterValue.trim().toLowerCase()
    
    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  toggleFilterCheckbox(event: MatCheckboxChange, box: number){
    switch(box) {
      case 1: //Fijos
      this.service.getClientsPref().subscribe((data) => {
        if (event.checked){
          this.activeFilters.push(data)
          this.recalculateFilters()
        } else {
          this.activeFilters = this.activeFilters.filter(active => 
            JSON.stringify(active) !== JSON.stringify(data)
          )
          
          this.recalculateFilters()
        }
      })
      break
      case 2: //Observaciones
        this.service.getObservationsClients().subscribe((data) => {
          if (event.checked){
            this.activeFilters.push(data)
            this.recalculateFilters()
          } else {
            this.activeFilters = this.activeFilters.filter(active => 
              JSON.stringify(active) !== JSON.stringify(data)
            )
            
            this.recalculateFilters()
          }
        })
    }
  }


  filterByDay(event: any){
    this.day = event.value
    
    if(this.food) {
      this.filterByFoodAndDay(this.food, event.value)
    } else {
      this.service.getClientsByDay(event.value).subscribe((data) => {
        if (this.selectByDayFilter) {
          this.deleteDayFilters(false)
        }
      
        this.selectByDayFilter = data
        this.activeFilters.push(data)
        this.recalculateFilters()
      });
    }
  }

  deleteDayFilters(reset: boolean){
    if(this.food && this.day){
      this.activeFilters = this.activeFilters.filter(active => 
        JSON.stringify(active) !== JSON.stringify(this.selectedByFoodAndDayFilter)
      )
    } else {  
      this.activeFilters = this.activeFilters.filter(active => 
        JSON.stringify(active) !== JSON.stringify(this.selectByDayFilter)
      )
    }
    
    if(reset){
      this.day = null
    }

    this.recalculateFilters()
  }
  

  filterByCategory(event: any){
    if(this.foods){
      this.isSubCategorySelected = false
      this.isCategorySelected = false 
      this.subCategory = null
    }
    setTimeout(() => { 
      this.isCategorySelected = true
    }, 10)
    
    this.subcategories = this.categories[event.value].subCategories
    //console.log(this.subcategories)
  }

  filterBySubCategory(event: any){
    this.isSubCategorySelected = true
    this.foods = this.subcategories[event.value].foods
  }

  filterByFood(event:any){
    this.food = event.value
    
    if(this.day){
      this.filterByFoodAndDay(event.value, this.day)
    } else {
      this.service.getClientsByFood(event.value).subscribe((data) => {
        if (this.selectByFoodFilter) {
          this.deleteFoodFilters(false)
        }
  
        this.selectByFoodFilter = data
        this.activeFilters.push(data)
        this.recalculateFilters()
      })
    }
  }

  deleteFoodFilters(reset: boolean){

    if(this.food && this.day){
      this.activeFilters = this.activeFilters.filter(active => 
        JSON.stringify(active) !== JSON.stringify(this.selectedByFoodAndDayFilter)
      )
    } else {  
      this.activeFilters = this.activeFilters.filter(active => 
        JSON.stringify(active) !== JSON.stringify(this.selectByFoodFilter)
      )
    }

    if(reset){
      this.category = null
      this.subCategory = null
      this.food = null
      this.isSubCategorySelected = false
      this.isCategorySelected = false 
    }
    
    this.recalculateFilters()
  }


  filterByFoodAndDay(food: string, day: string){
    this.service.getClientsByFoodAndDay(food, day).subscribe((data) => {
      if (this.selectedByFoodAndDayFilter) {
        this.activeFilters = this.activeFilters.filter(active => 
          JSON.stringify(active) !== JSON.stringify(this.selectedByFoodAndDayFilter)
        )
      }

      this.selectedByFoodAndDayFilter = data
      this.activeFilters.push(data)
      this.recalculateFilters()
    })
  }

  recalculateFilters(){
    this.filteredClients = this.activeFilters.reduce((acc, filter) =>
      acc.filter(client => filter.some(filteredClient => filteredClient.id === client.id)),
      this.posts 
    )
    console.log(this.filteredClients)
    this.dataSource = new MatTableDataSource(this.filteredClients)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }
}
