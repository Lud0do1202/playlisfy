import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SectionComponent } from '../../../../components/section/section/section.component';
import { FormsModule } from '@angular/forms';
import { DrapAndDropZoneComponent } from '../../../../components/files/drap-and-drop-zone/drap-and-drop-zone.component';
import { ListFilesComponent } from "../../../../components/files/list-files/list-files.component";

@Component({
  selector: 'pfy-playlists-page-section-spotify-history',
  standalone: true,
  imports: [FormsModule, SectionComponent, DrapAndDropZoneComponent, ListFilesComponent],
  templateUrl: './playlists-page-section-spotify-history.component.html',
  styleUrl: './playlists-page-section-spotify-history.component.scss',
})
export class PlaylistsPageSectionSpotifyHistoryComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   INPUTS                                   */
  /* -------------------------------------------------------------------------- */
  // Spotify history files
  @Input() files: File[] = [];

  /* -------------------------------------------------------------------------- */
  /*                                   OUTPUT                                   */
  /* -------------------------------------------------------------------------- */
  // Files changed
  @Output() onFilesChange = new EventEmitter<File[]>();

  // Handle new files dropped in the drop zone
  onNewFiles(newFiles: File[]) {
    this.files = this.files.concat(newFiles);
    this.onFilesChange.emit(this.files);
  }

  // Handle file removal
  onRemoveFile(index: number) {
    this.files.splice(index, 1);
    this.onFilesChange.emit(this.files);
  }

}
