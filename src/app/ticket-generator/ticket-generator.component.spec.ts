import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGeneratorComponent } from './ticket-generator.component';

describe('TicketGeneratorComponent', () => {
  let component: TicketGeneratorComponent;
  let fixture: ComponentFixture<TicketGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketGeneratorComponent]
    });
    fixture = TestBed.createComponent(TicketGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
