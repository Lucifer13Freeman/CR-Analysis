import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { INITIAL_MANUAL_READ_TABLE_DATA, INITIAL_TABLE_DATA, READ_FILE_TIMOUT } from 'src/app/shared/constants/constants';
import { IFileData } from 'src/app/shared/interfaces/file-data.interface';


@Injectable(
{
  providedIn: 'root'
})
export class FileDataReadService 
{
  constructor() { }

  private readFileDataSubject$: BehaviorSubject<IFileData<any>> = new BehaviorSubject<IFileData<any>>({ tableData: INITIAL_TABLE_DATA });

  public getReadFileData(): Observable<IFileData<any>>
  {
    return this.readFileDataSubject$.asObservable().pipe(delay(READ_FILE_TIMOUT));
  }

  public setReadFileData<T>(fileData: IFileData<T>)
  {
    this.readFileDataSubject$.next(fileData);
  }

  public clearReadFileData()
  {
    this.readFileDataSubject$.next({ tableData: {...INITIAL_TABLE_DATA} });
  }

  public setReadManualFileData()
  {
    this.readFileDataSubject$.next({ tableData: {...INITIAL_MANUAL_READ_TABLE_DATA} });
  }
}
