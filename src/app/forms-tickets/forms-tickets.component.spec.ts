import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsTicketsComponent } from './forms-tickets.component';

describe('FormsTicketsComponent', () => {
  let component: FormsTicketsComponent;
  let fixture: ComponentFixture<FormsTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormsTicketsComponent]
    });
    fixture = TestBed.createComponent(FormsTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
