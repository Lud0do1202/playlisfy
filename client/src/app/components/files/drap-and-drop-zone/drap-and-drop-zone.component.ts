import { Component, EventEmitter, Output } from '@angular/core';
import { DragAndDropDirective } from '../../../directives/drag-and-drop.directive';

@Component({
  selector: 'pfy-drap-and-drop-zone',
  standalone: true,
  imports: [DragAndDropDirective],
  templateUrl: './drap-and-drop-zone.component.html',
  styleUrl: './drap-and-drop-zone.component.scss',
})
export class DrapAndDropZoneComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   OUTPUT                                   */
  /* -------------------------------------------------------------------------- */
  @Output() onNewFiles: EventEmitter<File[]> = new EventEmitter<File[]>();

  /* -------------------------------------------------------------------------- */
  /*                                  FUNCTIONS                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Set the Spotify history files
   */
  setSpotifyHistoryFiles(fileList: FileList | null): void {
    const files = fileList ? Array.from(fileList) : [];
    this.onNewFiles.emit(files);
  }

  /**
   * Handles file input for Spotify history files.
   * Validates and stores the selected files.
   *
   * @param event - The file input event.
   */
  onSpotifyHistoryFilesBrowsed(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files ? Array.from(target.files) : [];
    this.onNewFiles.emit(files);
  }
}
