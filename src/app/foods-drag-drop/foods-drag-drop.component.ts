import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-foods-drag-drop',
  templateUrl: './foods-drag-drop.component.html',
  styleUrls: ['./foods-drag-drop.component.css']
})
export class FoodsDragDropComponent {

  foods = ['Paella', 'Pizza', 'Sushi oriental', 'Tacos con mucho queso'];
  foods2 = ['Paella', 'Pechuga de pollo frito', 'Albondigas de carne', 'Fingers de Pollo', 'Hamburguesa', 'Hamburguesa otra vez'];
  foods3 = ['Paella', 'Pechuga de pollo frito', 'Albondigas de carne', 'Fingers de Pollo', 'Hamburguesa', 'Hamburguesa otra vez'];

  @Output() foodSelected = new EventEmitter<string>();

  onDragStart(food: string) {
    console.log(food)
    this.foodSelected.emit(food);
  }

  onDragEnd() {
    this.foodSelected.emit('');
  }

  drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.foods, event.previousIndex, event.currentIndex); 
  }
}
