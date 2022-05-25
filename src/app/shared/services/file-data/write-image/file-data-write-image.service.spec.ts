import { TestBed } from '@angular/core/testing';

import { FileDataWriteImageService } from './file-data-write-image.service';

describe('FileDataWriteImageService', () => {
  let service: FileDataWriteImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileDataWriteImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
