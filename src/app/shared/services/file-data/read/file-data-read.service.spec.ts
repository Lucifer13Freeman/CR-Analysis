import { TestBed } from '@angular/core/testing';

import { FileDataReadService } from './file-data-read.service';

describe('FileDataReadService', () => {
  let service: FileDataReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDataReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
