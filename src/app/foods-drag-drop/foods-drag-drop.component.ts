import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FoodService } from '../service/food.service';
import { Food } from '../models/Food';
import { CategoriesService } from '../service/categories.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-foods-drag-drop',
  templateUrl: './foods-drag-drop.component.html',
  styleUrls: ['./foods-drag-drop.component.css']
})
export class FoodsDragDropComponent {

  data:any
  //selectedTab: number = 0;

  categoryForm: FormGroup
  showForm: boolean = false
  copySubCategories: boolean = false
  editingCategoryId: number = 0
  deletingCategoryId: number | null = null
  categoryEditName: string = ''

  addingFood: boolean = false
  addingFoodMap: { [subCategoryId: number]: boolean } = {}
  firstCategory: string = ''

  addingSubCategory: boolean = false
  editingSubCategory: { [subCategoryId: number]: boolean } = {}

  deletingFood: boolean = false
  dragFoodId: number = 0

  @Output() foodSelected = new EventEmitter<string>()
  @Output() maxSubcategoryLength = new EventEmitter<number>()
  @Input() edit: boolean = false

  constructor(private service: FoodService, private categoriesService: CategoriesService, private fb: FormBuilder) { 
    
    this.categoryForm = this.fb.group({
      name: [''], // Campo para el nombre
      copySubCategories: [false], // Estado del checkbox
      copyCategory: [''] // Categoría seleccionada
    });

    //Esto es necesario porque la pestaña del formulario a pesar de ser la ultima en el HTML, es la primera en crearse porque las pestañas de las categorias dependen de una peticion al back, esto causa que el formulario sobreescriba la primera pestaña del mat-tab-group, incluyendo el index. Por eso primero se renderizan las categorias y luego el formulario.
    setTimeout(() => {    
      this.showForm = true
    }, 200)
    
    this.loadList()
  }

  loadList(){
    this.categoriesService.getCategories().subscribe(data => {
      this.data = data
      
      if (this.data && this.data.length > 0) {
        this.categoryForm.patchValue({
          copyCategory: this.data[0].name
        });

        const maxSubCategoryLength = Math.max(...this.data.map((category: any) => category.subCategories.length))
        
        this.maxSubcategoryLength.emit(maxSubCategoryLength)
        console.log(maxSubCategoryLength)
      }
    })
  }

  //Drag and Drop
  onDragStart(food: string, foodId: number) {
    this.foodSelected.emit(food)
    this.deletingFood = true
    this.dragFoodId = foodId
  }

  onDragEnd() {
    this.foodSelected.emit('')
    this.deletingFood = false
    this.dragFoodId = 0
  }

  drop(event: CdkDragDrop<string[]>, index: any) {
    moveItemInArray(index, event.previousIndex, event.currentIndex)
  }


  //Gestion Comidas, Subcategorias y Categorias
  //Comidas
  toggleAddingFood(subCategoryId: number): void {
    this.addingFood = !this.addingFood
    this.addingFoodMap[subCategoryId] = !this.addingFoodMap[subCategoryId]
  }  

  saveFood(event: any, subCategoryId: number, categoryId: number): void{
    
    if(event.target.value != '') {
      const food: Food = {
        name: event.target.value,
        category: { id:categoryId },
        sub_category: { id:subCategoryId }
      }
  
      this.service.postFood(food).subscribe( Response => {
        console.log(Response)
      })
      this.loadList()
      this.loadList()
    }

    this.addingFoodMap[subCategoryId] = false;
    this.addingFood = !this.addingFood
    
  }
  
  deleteFood(){
    this.service.deleteFood(this.dragFoodId).subscribe(Response => {
      console.log(Response)
      this.loadList()
      this.deletingFood = false
    })
  }

  //Subcategorias
  saveSubCategory(event:any, categoryId: number): void {

    if(event.target.value != '') {
      const subCategory = {
        name: event.target.value,
        category: { id:categoryId }
      }
  
      this.categoriesService.postSubCategory(subCategory).subscribe( Response => {
        console.log(Response)
      })
      this.loadList()
      this.loadList()
    }
    this.addingSubCategory = !this.addingSubCategory
    
  }

  toggleSubCategoryEdit(subCategoryId: number): void {
    if(this.edit){
      this.editingSubCategory[subCategoryId] = !this.editingSubCategory[subCategoryId]
    }
  }  

  editSubcategory(event:any, subCategoryId: number){

    if(event.target.value != '') {
      const subCategory = {
        name: event.target.value
      }
  
      //A pesar de que funciona, siempre da un error, ya que el objeto no esta completo, pero el back lo maneja bien 
      this.categoriesService.putSubCategory(subCategoryId, subCategory).subscribe({error: () => {}})
      this.loadList()
      this.loadList()
    }
    this.editingSubCategory[subCategoryId] = false
    
  }

  deleteSubCategory(subCategoryId: number){
    this.categoriesService.deleteSubCategory(subCategoryId).subscribe(Response => {
      console.log(Response)
      this.loadList()
    })

    this.editingSubCategory[subCategoryId] = false;
    this.loadList()
    this.loadList()
  }


  //Categorias
  //Auntes: Antes la logica para copiar las subcategorias funcionaba con un ForEach, pero hacia que las subcategorias salieran desordenadas
  //Ahora esto funciona con promise, un objeto que es el resultado futuro a una operacion, async que "prepara" la promise, y await, que hasta que no se complete la promesa no sigue
  //Es decir, promise es el resultado a futuro declarado con async, y await recibe la promesa una a una, en vez de a la vez dando el resultado del forEach
  async onSubmitCategory(): Promise<void> {
    const formData = this.categoryForm.value
  
    this.categoriesService.postCategory(formData).subscribe(async (Response) => {
      if (formData.copySubCategories) {
        const newCategoryId = Response.id
        const subCategories = this.data.find((category: any) => category.name === formData.copyCategory)?.subCategories || []
  
        console.log(subCategories, formData.copyCategory)
  
        for (const subCategory of subCategories) {
          const newSubCategory = {
            name: subCategory.name,
            category: { id: newCategoryId }
          };
          console.log(newSubCategory)
  
          await this.categoriesService.postSubCategory(newSubCategory).toPromise()
        }
  
        this.loadList()
      } else {
        this.loadList()
      }
    })
  }
  

  deleteCategory(): void {
    this.categoriesService.deleteCategory(this.deletingCategoryId!).subscribe(Response => {
      console.log(Response)
      this.loadList()
      this.loadList()
    })
  }

  editingCategory(): void {
    console.log(this.editingCategoryId, this.categoryEditName)

    const category = {
      id: this.editingCategoryId,
      name: this.categoryEditName
    }

    this.categoriesService.putCategory(this.editingCategoryId!, category).subscribe({error: () => {}})
    this.loadList()
    this.loadList()
  }
}


