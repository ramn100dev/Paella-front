import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsDragDropComponent } from './foods-drag-drop.component';

describe('FoodsDragDropComponent', () => {
  let component: FoodsDragDropComponent;
  let fixture: ComponentFixture<FoodsDragDropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodsDragDropComponent]
    });
    fixture = TestBed.createComponent(FoodsDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
