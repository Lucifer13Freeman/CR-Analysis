import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { AnalysisDataDto } from 'src/app/shared/dto/analysis-data.dto';


@Injectable(
{
  providedIn: 'root'
})
export class WriteAnalysisDataService 
{
  constructor() { }

  private writeAnalysisDataSubject$: BehaviorSubject<AnalysisDataDto<any>> = new BehaviorSubject<AnalysisDataDto<any>>(new AnalysisDataDto());

  public getWriteAnalysisData(): Observable<AnalysisDataDto<any>>
  {
    return this.writeAnalysisDataSubject$.asObservable();
  }

  public setWriteAnalysisData<T>(analysisData: AnalysisDataDto<T>)
  {
    this.writeAnalysisDataSubject$.next(analysisData);
  }

  public clearWriteAnalysisData()
  {
    this.writeAnalysisDataSubject$.next(new AnalysisDataDto());
  }
}
