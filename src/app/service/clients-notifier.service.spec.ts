import { TestBed } from '@angular/core/testing';

import { ClientsNotifierService } from './clients-notifier.service';

describe('ClientsNotifierService', () => {
  let service: ClientsNotifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsNotifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
