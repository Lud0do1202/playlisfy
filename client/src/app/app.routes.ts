import { Routes } from '@angular/router';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { PlaylistsLoadingPageComponent } from './views/playlists-loading-page/playlists-loading-page.component';
import { PlaylistsPageComponent } from './views/playlists-page/playlists-page.component';

export const routes: Routes = [

  /**
   * Landing Page
   * - Animation of the logo
   * - Login to Spotify
   * - Login to Cyanite
   * - Redirect to 'Playlists Page'
   */
  { path: '', component: LandingPageComponent },

  /**
   * Playlists Page
   * - Datatable with all the playslists that Playlisfy should create
   * - Button that open a form modal to Create/Update a playlist
   *    - Name of the playlist
   *    - Description of the playlist
   * - Button that open a modal with the settings (cannot be lower than the default settings)
   * - Button to delete a playlist (Confirmation modal)
   * - Default Settings button that opens a modal with the following options:
   *    - Minimum play count required for a track to be added to the playlist
   *    - Maximum allowable skip rate for a track (as a percentage)
   *    - Criteria for defining a "skipped" track (in seconds or as a percentage)
   * - Button to add a variant (duplicate) but with different settings
   * - Input to put the zip folder with the Spotify history
   * - Button to create the playlists
   */
  { path: 'playlists', component: PlaylistsPageComponent },

  /**
   * 1. The playlists are being created with Spotify API
   *   - Fill the playlists objects with their new id
   * 2. The history is reduced (count, skip rate, etc)
   * 3. The history is being filtered by the settings
   * 4. The tags/moods/genres/... are being fetched from cyanite (through my server)
   *   - If track not analyzed, wait for it 
   * 5. The system prompt is builded with playlists (except variants)
   *   - id, name, description
   *   - Return tracks sorted to playlists
   * 6. Send this system prompt + 20 tracks with their tags,... to openai (through my server)
   * 7. Fill the playlists with the tracks and perhaps the variants
   * 8. Once openai calls are done, feed the spotify playlists with the tracks
   * 9. Display 'Thanks'
   */
  { path: 'playlists/loading', component: PlaylistsLoadingPageComponent },
];
