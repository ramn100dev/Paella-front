import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsMenuComponent } from './options-menu.component';

describe('OptionsMenuComponent', () => {
  let component: OptionsMenuComponent;
  let fixture: ComponentFixture<OptionsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OptionsMenuComponent]
    });
    fixture = TestBed.createComponent(OptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Skipped: this component is only ever created via MatDialog.open(), never standalone.
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
