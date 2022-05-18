import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INITIAL_TABLE_DATA } from 'src/app/shared/constants/constants';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';


@Injectable(
{
  providedIn: 'root'
})
export class FileDataWriteCalcService 
{
  constructor() { }

  private writeCalcFileDataSubject$: BehaviorSubject<IFileData<any>> = new BehaviorSubject<IFileData<any>>({ tableData: INITIAL_TABLE_DATA });

  public getWriteCalcFileData(): Observable<IFileData<any>>
  {
    return this.writeCalcFileDataSubject$.asObservable();
  }

  public setWriteCalcFileData<T>(fileData: IFileData<T>)
  {
    this.writeCalcFileDataSubject$.next(fileData);
  }

  public clearWriteCalcFileData()
  {
    this.writeCalcFileDataSubject$.next({ tableData: {...INITIAL_TABLE_DATA} });
  }
}
