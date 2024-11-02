import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../services/router.service';

/**
 * Landing Page
 * - Animation of the logo
 * - Redirect to 'Login Spotify Page'
 */
@Component({
  selector: 'pfy-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  /**
   * Delay before redirecting in ms
   */
  private readonly DELAY = 3000;

  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private router: RouterService) {}

  /* -------------------------------------------------------------------------- */
  /*                                    INIT                                    */
  /* -------------------------------------------------------------------------- */
  ngOnInit(): void {
    // Redirect to 'Login Spotify Page' after delay
    setTimeout(() => this.router.redirect('login-spotify-page'), this.DELAY);
  }
}