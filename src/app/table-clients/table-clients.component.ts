import { Component, inject, ViewChild } from '@angular/core';
import { ClientsService } from '../service/clients.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormComponent } from '../client-form/client-form.component';
import { OptionsMenuComponent } from '../options-menu/options-menu.component';
import { Client } from '../models/Client';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { CategoriesService } from '../service/categories.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { FormsTicketsComponent } from '../forms-tickets/forms-tickets.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientsNotifierService } from '../service/clients-notifier.service';



@Component({
    imports: [
        CommonModule,
        FormsModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatSelectModule,
        MatButtonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule
    ],
    selector: 'app-table-clients',
    templateUrl: './table-clients.component.html',
    styleUrls: ['./table-clients.component.css']
})
export class TableClientsComponent {
  displayedColumn:string[] = ['name', 'address', 'phone']
  dataSource!: MatTableDataSource<Client>
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  posts: Client[] = []
  highlightMode = localStorage.getItem('highlightOption')

  private service = inject(ClientsService)
  private categoriesService = inject(CategoriesService)
  private router = inject(Router)
  private dialog = inject(MatDialog)
  private notifier = inject(ClientsNotifierService)

  constructor() { 
    this.getClientList()
    this.notifier.clientsChanged.subscribe(() => {
      this.getClientList()
    })
  }

  getClientList() {
    this.service.getClients().subscribe(data => {
      this.posts = data
      //console.log(this.posts)

      if (this.activeFilters.length > 0) {
        this.recalculateFilters()
      } else {
        this.dataSource = new MatTableDataSource(this.posts)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }

      this.paginator._intl.itemsPerPageLabel = "Clientes por pagina"
    })
  }

  loadSchedule(client: any){
    this.router.navigate(['/schedule', client.id])
  }

  openClientForm(){
    const dialogRef = this.dialog.open(ClientFormComponent, {
      data: { isEditMode: false },
      width: '350px',
    })
  }

  openOptions(){
    const dialogRef = this.dialog.open(OptionsMenuComponent, {
      width: '80%',
      height: '80%'
    })
  }

  openForms(){
    const dialogRef = this.dialog.open(FormsTicketsComponent, {
      width: '60%',
      height: '80%'
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
  subcategories: any[] = []
  foods: any[] = []

  searchValue = ""
  prefFilter = false
  observationState = false
  selectByDay = false
  isCategorySelected = false
  isSubCategorySelected = false

  activeFilters: any[][] = []
  filteredClients: any[] = []
  selectByDayFilter: any[] | null = null
  selectByFoodFilter: any[] | null = null
  selectByPrefFilter: any[] | null = null
  selectByObservationFilter: any[] | null = null

  day = ""
  food = ""
  category = ""
  subCategory = ""
  selectedByFoodAndDayFilter: any[] | null = null

  toggleDrawer(){
    this.isDrawerOpen = !this.isDrawerOpen

    this.categoriesService.getCategories().subscribe(data => {
      this.categories = data
    })
  }

  toggleFilterCheckbox(event: MatCheckboxChange, box: number){
    switch(box) {
      case 1: //Fijos
        if (event.checked) {
          this.service.getClientsPref().subscribe((data) => {
            this.selectByPrefFilter = data
            this.activeFilters.push(data)
            this.recalculateFilters()
          })
        } else {
          this.removeActiveFilter(this.selectByPrefFilter)
          this.selectByPrefFilter = null
        }
        break
      case 2: //Observaciones
        if (event.checked) {
          this.service.getObservationsClients().subscribe((data) => {
            this.selectByObservationFilter = data
            this.activeFilters.push(data)
            this.recalculateFilters()
          })
        } else {
          this.removeActiveFilter(this.selectByObservationFilter)
          this.selectByObservationFilter = null
        }
    }
  }

  removeActiveFilter(filter: any[] | null){
    if (!filter) {
      return
    }

    this.activeFilters = this.activeFilters.filter(active => active !== filter)
    this.recalculateFilters()
  }


  filterByDay(event: any){
    this.day = event.value

    if(this.food) { //Para aplicar el filtro de dias y comidas, se revisa si ya esta uno o otro
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

  deleteDayFilters(reset: boolean){ //En el caso de cambiar el select, reset false. Si le das al boton del HTML true
    this.activeFilters = this.activeFilters.filter(active =>
      JSON.stringify(active) !== JSON.stringify(this.selectedByFoodAndDayFilter)
    )
    this.selectedByFoodAndDayFilter = null

    this.activeFilters = this.activeFilters.filter(active =>
      JSON.stringify(active) !== JSON.stringify(this.selectByDayFilter)
    )
    this.selectByDayFilter = null

    if (reset) {
      this.day = ""
    }

    if (this.food) {
      this.service.getClientsByFood(this.food).subscribe((data) => {
        this.selectByFoodFilter = data
        this.activeFilters.push(data)
        this.recalculateFilters()
      })
    } else {
      this.recalculateFilters()
    }
  }


  filterByCategory(event: any){
    if(this.foods){
      this.isSubCategorySelected = false
      this.isCategorySelected = false
      this.subCategory = ""
    }
    setTimeout(() => {
      this.isCategorySelected = true
    }, 10)

    this.subcategories = this.categories[event.value].subCategories
    this.deleteFoodFilters(false)
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

    this.activeFilters = this.activeFilters.filter(active =>
      JSON.stringify(active) !== JSON.stringify(this.selectedByFoodAndDayFilter)
    )
    this.selectedByFoodAndDayFilter = null

    this.activeFilters = this.activeFilters.filter(active =>
      JSON.stringify(active) !== JSON.stringify(this.selectByFoodFilter)
    )
    this.selectByFoodFilter = null

    if (reset) {
      this.food = ""
      this.category = ""
      this.subCategory = ""
      this.isSubCategorySelected = false
      this.isCategorySelected = false
    }

    if (this.day) {
      this.service.getClientsByDay(this.day).subscribe((data) => {
        this.selectByDayFilter = data
        this.activeFilters.push(data)
        this.recalculateFilters()
      })
    } else {
      this.recalculateFilters()
    }
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
    );

    this.filteredClients.sort((a, b) => a.preference - b.preference)

    this.dataSource = new MatTableDataSource(this.filteredClients)
    this.dataSource.paginator = this.paginator
    this.dataSource.sort = this.sort
  }

}
