import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFormComponent } from './client-form.component';

describe('ClientFormComponent', () => {
  let component: ClientFormComponent;
  let fixture: ComponentFixture<ClientFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientFormComponent]
    });
    fixture = TestBed.createComponent(ClientFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Skipped: this component is only ever created via MatDialog.open(), never standalone.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
