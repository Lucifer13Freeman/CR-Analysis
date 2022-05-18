import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWriterComponent } from './file-writer.component';

describe('FileWriterComponent', () => {
  let component: FileWriterComponent;
  let fixture: ComponentFixture<FileWriterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileWriterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWriterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
