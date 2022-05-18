import { TestBed } from '@angular/core/testing';

import { FileDataWriteRangService } from './file-data-write-rang.service';

describe('FileDataWriteRangService', () => {
  let service: FileDataWriteRangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDataWriteRangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
