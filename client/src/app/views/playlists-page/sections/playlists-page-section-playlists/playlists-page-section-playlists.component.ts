import { Component, Input } from '@angular/core';
import { SectionComponent } from "../../../../components/section/section/section.component";
import { CardListComponent } from "../../../../components/card/card-list/card-list.component";
import { CardItemComponent } from "../../../../components/card/card-item/card-item.component";
import { Playlist } from '../../../../types/playlist';
import { NgFor } from '@angular/common';

@Component({
  selector: 'pfy-playlists-page-section-playlists',
  standalone: true,
  imports: [SectionComponent, CardListComponent, CardItemComponent, NgFor],
  templateUrl: './playlists-page-section-playlists.component.html',
  styleUrl: './playlists-page-section-playlists.component.scss'
})
export class PlaylistsPageSectionPlaylistsComponent {
  /* -------------------------------------------------------------------------- */
  /*                                   INPUTS                                   */
  /* -------------------------------------------------------------------------- */
  // Playlists
  @Input() playlists: Playlist[] = [];

  /* -------------------------------------------------------------------------- */
  /*                                   ACTIONS                                  */
  /* -------------------------------------------------------------------------- */
  // Create new playlist
  createNewPlaylist() {
    this.playlists.push({ name: '', description: '', tracks: [] });
  }
}
