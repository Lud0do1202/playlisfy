import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { InternalRoutes } from '../../enums/internal-routes';
import { CyaniteService } from '../../services/cyanite.service';
import { SpotifyService } from '../../services/spotify.service';

/**
 * Landing Page
 * - Animation of the logo
 * - Login to Spotify
 * - Login to Cyanite
 * - Redirect to 'Playlists Page'
 */
@Component({
  selector: 'pfy-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                 ATTRIBUTES                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Delay before redirecting in ms
   */
  private readonly DELAY = 1500;

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private router: RouterService, private cyanite: CyaniteService, private spotify: SpotifyService) {}

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Login after delay
    setTimeout(() => {
      // Spotify
      this.spotify.login().then((spotifyToken) => {
        // Spotify login unsuccessful
        if (spotifyToken === null) return;

        // Cyanite
        this.cyanite.login().subscribe((_) => {
          // Redirect to 'Playlists Page'
          this.router.redirect(InternalRoutes.PlaylistsPage);
        });
      });
    }, this.DELAY);
  }
}
