export interface IColumnSchemaElement
{
  key: string | 'isSelected';
  type: 'number' | 'text' | 'isSelected';
  label: string;
}