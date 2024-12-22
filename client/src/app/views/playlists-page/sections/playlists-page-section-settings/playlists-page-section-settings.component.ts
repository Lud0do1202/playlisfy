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
  @Input() settings: PlaylistsSettings = {}
}
