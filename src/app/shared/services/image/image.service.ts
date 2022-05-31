import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { FILENAME } from '../../constants/constants';
import { ImageDataDto } from '../../dto/image-data.dto';
import { ImageExtEnum } from '../../enums/enums';


@Injectable(
{
  providedIn: 'root'
})
export class ImageService 
{
  constructor() { }

  writeCanvasImage(dto: ImageDataDto)
  {
    const { canvasElement, extension, filename } = dto;

    if (canvasElement) this.saveFile(canvasElement, filename, extension);
  }

  private saveFile(canvasElement: HTMLCanvasElement, 
                  filename: string = FILENAME,
                  extension: string = ImageExtEnum.PNG): void
  {
    canvasElement.toBlob((data: any) => 
    {
      saveAs(data, `${filename}-${new Date().valueOf()}.${extension}`);
    }, `image/${extension}`, 1);
  }
}
