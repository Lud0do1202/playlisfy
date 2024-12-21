import { Component } from '@angular/core';
import { PlaylistsPageSectionSettingsComponent } from "./sections/playlists-page-section-settings/playlists-page-section-settings.component";
import { PlaylistsPageSectionHeaderComponent } from "./sections/playlists-page-section-header/playlists-page-section-header.component";
import { PlaylistsPageSectionSpotifyHistoryComponent } from "./sections/playlists-page-section-spotify-history/playlists-page-section-spotify-history.component";

@Component({
  selector: 'pfy-playlists-page',
  standalone: true,
  imports: [PlaylistsPageSectionSettingsComponent, PlaylistsPageSectionHeaderComponent, PlaylistsPageSectionSpotifyHistoryComponent],
  templateUrl: './playlists-page.component.html',
  styleUrl: './playlists-page.component.scss',
})
export class PlaylistsPageComponent {


}
