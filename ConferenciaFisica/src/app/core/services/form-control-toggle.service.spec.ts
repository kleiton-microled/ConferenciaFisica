import { TestBed } from '@angular/core/testing';

import { FormControlToggleService } from './form-control-toggle.service';

describe('FormControlToggleService', () => {
  let service: FormControlToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormControlToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
