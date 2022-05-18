export class TableDataDto<T>
{
    readonly data: Array<T> = [];
    readonly header?: Array<string> = []; 
}