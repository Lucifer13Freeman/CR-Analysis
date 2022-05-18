import { FILENAME } from "../constants/constants";
import { ImageExtEnum } from "../enums/enums";
import { PossibleExtEnum } from "../types/types";


export class ImageDataDto
{
    readonly canvasElement?: HTMLCanvasElement;
    readonly filename?: string = FILENAME;
    readonly extension?: PossibleExtEnum = ImageExtEnum.PNG;
}