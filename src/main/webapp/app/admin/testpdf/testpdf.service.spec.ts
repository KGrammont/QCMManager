import { TestBed } from '@angular/core/testing';

import { TestpdfService } from './testpdf.service';

describe('TestpdfService', () => {
  let service: TestpdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestpdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
