import { Component, Input } from '@angular/core';
import { PlaylistsPageSectionSettingsComponent } from './sections/playlists-page-section-settings/playlists-page-section-settings.component';
import { PlaylistsPageSectionHeaderComponent } from './sections/playlists-page-section-header/playlists-page-section-header.component';
import { PlaylistsPageSectionSpotifyHistoryComponent } from './sections/playlists-page-section-spotify-history/playlists-page-section-spotify-history.component';
import { PlaylistsPageSectionPlaylistsComponent } from './sections/playlists-page-section-playlists/playlists-page-section-playlists.component';
import { PlaylistsSettings } from '../../types/playlists-settings';
import { SpotifyService } from '../../services/spotify.service';
import { MemorySpotifyHistory } from '../../types/memory-spotify-history';
import { Playlist } from '../../types/playlist';

@Component({
  selector: 'pfy-playlists-page',
  standalone: true,
  imports: [
    PlaylistsPageSectionSettingsComponent,
    PlaylistsPageSectionHeaderComponent,
    PlaylistsPageSectionSpotifyHistoryComponent,
    PlaylistsPageSectionPlaylistsComponent,
  ],
  templateUrl: './playlists-page.component.html',
  styleUrl: './playlists-page.component.scss',
})
export class PlaylistsPageComponent {
  /* -------------------------------------------------------------------------- */
  /*                                    PROPS                                   */
  /* -------------------------------------------------------------------------- */
  // History files
  files: File[] = [];

  // Settings
  settings: PlaylistsSettings = {
    minimalSongDuration: undefined,
    afterDate: undefined,
    minimalPlayCount: undefined,
    maximumSkipRate: undefined,
    maximumPlaylistLength: undefined,
  };

  // Playlists
  playlists: Playlist[] = [];

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private spotify: SpotifyService) {}

  /* -------------------------------------------------------------------------- */
  /*                                   SUBMIT                                   */
  /* -------------------------------------------------------------------------- */
  async submit() {
    console.log(this.files);
    console.log(this.playlists);
    console.log(this.settings);

    if (!this.checkCanSubmit()) {
      console.error(
        'Submission failed due to the following issues:\n' +
          '- History not loaded. Please ensure data is available.\n' +
          '- No playlists found. You need to create at least one playlist.\n' +
          '- One or more playlists are missing a name or description. Please provide complete information.'
      );
      return;
    }

    // Get the history filtered by the settings
    const history = await this.spotify.filterHistory(this.files, this.settings);

    // Log all playlists
    console.log(history)
  }

  checkCanSubmit() {
    // Must load the spotify history first
    if (this.files.length === 0) return false;

    // Must have at least one playlist
    if (this.playlists.length === 0) return false;

    // All playlists must have a name and description
    return !this.playlists.some((playlist) => playlist.name.trim() === '' || playlist.description.trim() === '');
  }
}
