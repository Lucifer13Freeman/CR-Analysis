import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INITIAL_IMAGE_DATA } from 'src/app/shared/constants/constants';
import { ImageDataDto } from 'src/app/shared/dto/image-data.dto';

@Injectable(
{
  providedIn: 'root'
})
export class FileDataWriteImageService 
{
  constructor() { }

  private writeImageFileDataSubject$: BehaviorSubject<ImageDataDto> = new BehaviorSubject<ImageDataDto>({ ...INITIAL_IMAGE_DATA });

  public getWriteImageFileData(): Observable<ImageDataDto>
  {
    return this.writeImageFileDataSubject$.asObservable();
  }

  public setWriteImageFileData(imageData: ImageDataDto)
  {
    this.writeImageFileDataSubject$.next(imageData);
  }

  public clearWriteImageFileData()
  {
    this.writeImageFileDataSubject$.next({ ...INITIAL_IMAGE_DATA });
  }
}
