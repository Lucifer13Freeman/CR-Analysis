import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INITIAL_TABLE_DATA } from 'src/app/shared/constants/constants';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';


@Injectable(
{
  providedIn: 'root'
})
export class FileDataWriteRangService 
{
  constructor() { }

  private writeRangFileDataSubject$: BehaviorSubject<IFileData<any>> = new BehaviorSubject<IFileData<any>>({ tableData: INITIAL_TABLE_DATA });

  public getWriteRangFileData(): Observable<IFileData<any>>
  {
    return this.writeRangFileDataSubject$.asObservable();
  }

  public setWriteRangFileData<T>(fileData: IFileData<T>)
  {
    this.writeRangFileDataSubject$.next(fileData);
  }

  public clearWriteRangFileData()
  {
    this.writeRangFileDataSubject$.next({ tableData: {...INITIAL_TABLE_DATA} });
  }
}
