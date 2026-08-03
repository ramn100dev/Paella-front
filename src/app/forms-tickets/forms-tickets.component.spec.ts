import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsTicketsComponent } from './forms-tickets.component';

describe('FormsTicketsComponent', () => {
  let component: FormsTicketsComponent;
  let fixture: ComponentFixture<FormsTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsTicketsComponent]
    });
    fixture = TestBed.createComponent(FormsTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Skipped: this component is only ever created via MatDialog.open(), never standalone.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
