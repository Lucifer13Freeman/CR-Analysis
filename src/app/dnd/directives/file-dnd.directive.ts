import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener
} from '@angular/core';


@Directive(
{
  selector: '[appFileDnd]'
})
export class FileDndDirective 
{
  constructor() { }

  @HostBinding('class.fileover') 
  fileOver?: boolean;
  
  @Output() 
  fileDropped = new EventEmitter<any>();

  // Dragover listener
  @HostListener('dragover', ['$event']) 
  onDragOver(event: any) 
  {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) 
  public onDragLeave(event: any) 
  {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) 
  public onDrop(event: any) 
  {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;

    const files = event.dataTransfer.files;

    if (files.length > 0) 
    {
      this.fileDropped.emit(files);
    }
  }
}
