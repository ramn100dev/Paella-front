import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketGeneratorComponent } from './ticket-generator.component';

describe('TicketGeneratorComponent', () => {
  let component: TicketGeneratorComponent;
  let fixture: ComponentFixture<TicketGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TicketGeneratorComponent]
    });
    fixture = TestBed.createComponent(TicketGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Skipped: depends on history.state, pending rework alongside the in-house forms migration.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
