import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { ScheduleTableComponent } from './schedule-table.component';

describe('ScheduleTableComponent', () => {
  let component: ScheduleTableComponent;
  let fixture: ComponentFixture<ScheduleTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ScheduleTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    });
    fixture = TestBed.createComponent(ScheduleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
