import { Component } from '@angular/core';
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
  /**
   * JSON file containing the Spotify history
   */
  spotifyHistoryFiles: File[] = [];
}
