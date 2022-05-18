import { TestBed } from '@angular/core/testing';

import { WriteAnalysisService } from './write-analysis.service';

describe('WriteAnalysisService', () => {
  let service: WriteAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
