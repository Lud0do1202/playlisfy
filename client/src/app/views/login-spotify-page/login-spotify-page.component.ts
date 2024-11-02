import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../services/router.service';
import { InternalRoutes } from '../../enums/internal-routes';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'pfy-login-spotify-page',
  standalone: true,
  imports: [],
  templateUrl: './login-spotify-page.component.html',
  styleUrl: './login-spotify-page.component.scss',
})
export class LoginSpotifyPageComponent implements OnInit {
  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private spotify: SpotifyService, private router: RouterService) {}

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Login with Spotify
    this.spotify
      .login()
      .then((logged) => {
        // Redirect to 'Login Cyanite Page' if logged in
        if (logged) this.router.redirect(InternalRoutes.LoginCyanitePage);
      })
      .catch((error) => {
        console.error('Error logging in with Spotify', error);
      });
  }
}
