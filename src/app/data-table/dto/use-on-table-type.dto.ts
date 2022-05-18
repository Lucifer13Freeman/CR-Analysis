import { TableTypeEnum } from "../enums/table-type.enum";


export class UseOnTableDto
{
    readonly tableType?: TableTypeEnum;
    readonly onInput?: Function = () => {};
    readonly onOutputCalc?: Function = () => {};
    readonly onOutputRang?: Function = () => {};
    readonly onOutputExtCalc?: Function = () => {};
}