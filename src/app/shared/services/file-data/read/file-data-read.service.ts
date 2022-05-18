import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INITIAL_MANUAL_READ_TABLE_DATA, INITIAL_TABLE_DATA } from 'src/app/shared/constants/constants';
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
    return this.readFileDataSubject$.asObservable();
  }

  public setReadFileData<T>(fileData: IFileData<T>)
  {
    // setTimeout(() => 
    // {
    //   if (fileData.data)
    //   {
    //     const currReadFileData: IFileData<any> = this.readFileDataSubject$.value;
    //     const header = fileData.header?.length !== 0 
    //                         ? fileData.header 
    //                         : this.utilsServise.makeHeaderFromObjKeys(fileData.data[0]);
    //     const filename = fileData.filename 
    //                         ? fileData.filename 
    //                         : currReadFileData.filename;
    //     const extension = fileData.extension 
    //                         ? fileData.extension 
    //                         : currReadFileData.extension;

    //     const nextFileData: IFileData<T> = {
    //       data: fileData.data,
    //       header,
    //       filename, 
    //       extension
    //     }

    //     this.readFileDataSubject$.next(nextFileData);
    //     console.log(nextFileData.data)
    //   }
    // }, 1000)

    this.readFileDataSubject$.next(fileData);
  }

  public clearReadFileData()
  {
    // console.log(INITIAL_TABLE_DATA)
    // console.log(Object.assign({}, INITIAL_TABLE_DATA))
    // console.log({ tableData: { data: [], header: [] } })
    // console.log(this.readFileDataSubject$.value)
    this.readFileDataSubject$.next({ tableData: {...INITIAL_TABLE_DATA} });
    // console.log(this.readFileDataSubject$.value)
  }

  public setReadManualFileData()
  {
    this.readFileDataSubject$.next({ tableData: {...INITIAL_MANUAL_READ_TABLE_DATA} });
  }

  // public checkReadFileData(): boolean
  // {
  //   return this.readFileDataSubject$.getValue().tableData.data.length !== 0;
  // }
}
