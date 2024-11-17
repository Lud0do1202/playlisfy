import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[pfyDragAndDrop]',
  standalone: true,
})
export class DragAndDropDirective {
  /* -------------------------------------------------------------------------- */
  /*                                   OUTPUTS                                  */
  /* -------------------------------------------------------------------------- */
  /* ------------------------------ File Dropped ------------------------------ */
  /**
   * Event emitted when the user drops files
   */
  @Output() filesDropped = new EventEmitter<FileList>();

  /* -------------------------------------------------------------------------- */
  /*                                HOST BINDING                                */
  /* -------------------------------------------------------------------------- */
  /**
   * Add the class 'fileover' to the host element when the user is dragging a file over it
   */
  @HostBinding('class.fileover')
  fileOver: boolean = false;

  /* -------------------------------------------------------------------------- */
  /*                                HOST LISTENER                               */
  /* -------------------------------------------------------------------------- */
  /* -------------------------------- Drag Over ------------------------------- */
  /**
   * 
   * @param event 
   */
  @HostListener('dragover', ['$event'])
  public onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // File is over target
    this.fileOver = true;
  }

  /* ------------------------------- Drag Leave ------------------------------- */
  /**
   * 
   * @param event 
   */
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // File is leaving the target
    this.fileOver = false
  }

  /* ---------------------------------- Drop ---------------------------------- */
  /**
   * 
   * @param event 
   */
  @HostListener('drop', ['$event'])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    // The file stop overing he target
    this.fileOver = false;

    // Emit the files dropped
    const files = event.dataTransfer?.files;
    if (files) {
      this.filesDropped.emit(files);
    }
  }
}
