import { Component, Input } from '@angular/core';
import { CardItemComponent } from '../../../../components/card/card-item/card-item.component';
import { SpotifyService } from '../../../../services/spotify.service';
import { PlaylistsSettings } from '../../../../types/playlists-settings';
import { CardListComponent } from '../../../../components/card/card-list/card-list.component';
import { FormsModule } from '@angular/forms';
import { SectionComponent } from "../../../../components/section/section/section.component";

@Component({
  selector: 'pfy-playlists-page-section-settings',
  standalone: true,
  imports: [CardItemComponent, CardListComponent, FormsModule, SectionComponent],
  templateUrl: './playlists-page-section-settings.component.html',
  styleUrl: './playlists-page-section-settings.component.scss',
})
export class PlaylistsPageSectionSettingsComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   INPUTS                                   */
  /* -------------------------------------------------------------------------- */
  @Input() files: File[] = [];

  /* -------------------------------------------------------------------------- */
  /*                                    PROPS                                   */
  /* -------------------------------------------------------------------------- */
  settings: PlaylistsSettings = {
    minimalSongDuration: undefined,
    afterDate: undefined,
    minimalPlayCount: undefined,
    maximumSkipRate: undefined,
    maximumPlaylistLength: undefined,
  };

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private spotify: SpotifyService) {}

  /* -------------------------------------------------------------------------- */
  /*                                   PUBLIC                                   */
  /* -------------------------------------------------------------------------- */
  /**
   * Handles the form submission event.
   * Prevents the default behavior and logs the settings.
   *
   * @param event - The form submission event.
   */
  async onSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Get the history filtered by the settings
    const history = await this.spotify.filterHistory(this.files, this.settings);
  }
}
