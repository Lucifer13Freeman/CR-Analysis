import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisParamsComponent } from './analysis-params.component';

describe('AnalysisParamsComponent', () => {
  let component: AnalysisParamsComponent;
  let fixture: ComponentFixture<AnalysisParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalysisParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
