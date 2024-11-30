import { randomColorCard } from './../../enums/color-cards';
import { Component, OnInit } from '@angular/core';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { PlaylistsSettings } from '../../types/playlists-settings';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'pfy-playlists-page',
  standalone: true,
  imports: [DragAndDropDirective, NgIf, FormsModule],
  templateUrl: './playlists-page.component.html',
  styleUrl: './playlists-page.component.scss',
})
export class PlaylistsPageComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private spotify: SpotifyService) {}

  /* -------------------------------------------------------------------------- */
  /*                               SPOTIFY HISTORY                              */
  /* -------------------------------------------------------------------------- */
  /**
   * JSON file containing the Spotify history
   */
  spotifyHistoryFiles: File[] = [];

  /**
   * Set the Spotify history files
   */
  setSpotifyHistoryFiles(fileList: FileList | null): void {
    this.spotifyHistoryFiles = fileList ? Array.from(fileList) : [];
  }

  /**
   * Handles file input for Spotify history files.
   * Validates and stores the selected files.
   *
   * @param event - The file input event.
   */
  onSpotifyHistoryFilesBrowsed(event: Event): void {
    // Cast the event target to an HTMLInputElement
    const target = event.target as HTMLInputElement;
    if (!target.files) {
      this.setSpotifyHistoryFiles(null);
      return;
    }

    // Save the files
    const files = target.files;
    this.setSpotifyHistoryFiles(files);
  }

  /**
   * Removes a Spotify history file at the specified index.
   *
   * @param index - The index of the file to remove.
   */
  removeSpotifyHistoryFile(index: number): void {
    if (this.spotifyHistoryFiles) {
      this.spotifyHistoryFiles.splice(index, 1);
    }
  }

  /**
   * Formats a file size in bytes into a human-readable string.
   *
   * @param bytes - The file size in bytes.
   * @param decimals - Number of decimal places (default is 2).
   * @returns A formatted string representing the size in appropriate units.
   */
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /* -------------------------------------------------------------------------- */
  /*                                  SETTTINGS                                 */
  /* -------------------------------------------------------------------------- */

  /**
   * Number of setting card items.
   */
  private readonly SETTING_CARD_ITEM_COUNT = 5;

  /**
   * Array of CSS classes for setting card items.
   */
  settingCardItemClasses: string[] = [];

  /**
   * Form settings.
   */
  settings: PlaylistsSettings = {
    minimalSongDuration: undefined,
    afterDate: undefined,
    minimalPlayCount: undefined,
    maximumSkipRate: undefined,
    maximumPlaylistLength: undefined,
  };

  /**
   * Generates a CSS class for a setting card item with a random color.
   *
   * @returns A string representing the CSS class for the card item.
   */
  getSettingCardItemClass(): string {
    return 'setting-cards-item setting-cards-item-' + randomColorCard();
  }

  /**
   * Handles the form submission event.
   * Prevents the default behavior and logs the settings.
   *
   * @param event - The form submission event.
   */
  async onSubmit(event: SubmitEvent) {
    event.preventDefault();

    // Get the history filtered by the settings
    const history = await this.spotify.filterHistory(this.spotifyHistoryFiles, this.settings);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Generate setting card item classes
    this.settingCardItemClasses = Array(this.SETTING_CARD_ITEM_COUNT)
      .fill(null)
      .map(() => 'setting-cards-item setting-cards-item-' + randomColorCard());
  }
}
