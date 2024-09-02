import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableClientsComponent } from './table-clients.component';

describe('TableClientsComponent', () => {
  let component: TableClientsComponent;
  let fixture: ComponentFixture<TableClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableClientsComponent]
    });
    fixture = TestBed.createComponent(TableClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
