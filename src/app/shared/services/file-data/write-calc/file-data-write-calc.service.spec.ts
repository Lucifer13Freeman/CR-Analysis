import { TestBed } from '@angular/core/testing';

import { FileDataWriteCalcService } from './file-data-write-calc.service';

describe('FileDataWriteCalcService', () => {
  let service: FileDataWriteCalcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDataWriteCalcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
