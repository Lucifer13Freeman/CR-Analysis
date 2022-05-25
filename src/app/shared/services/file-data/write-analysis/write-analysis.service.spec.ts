import { TestBed } from '@angular/core/testing';

import { WriteAnalysisDataService } from './write-analysis.service';

describe('WriteAnalysisService', () => {
  let service: WriteAnalysisDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WriteAnalysisDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
