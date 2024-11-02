import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternalRoutes } from '../enums/internal-routes';

/**
 * Service responsible for handling route navigation within the application.
 *
 * This service provides a method to redirect the user to a specified route
 * based on predefined route keys in the Routes object. By centralizing
 * routing logic, this service promotes cleaner code and easier navigation management.
 *
 */
@Injectable({
  providedIn: 'root',
})
export class RouterService {
  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private router: Router) {}

  /* -------------------------------------------------------------------------- */
  /*                                   PUBLIC                                   */
  /* -------------------------------------------------------------------------- */
  /* -------------------------------- Redirect -------------------------------- */
  /**
   * Redirects the user to the specified route.
   *
   * @param route - The key representing the target route, as defined in the Routes object.
   *                Example values: 'landing-page', 'login-spotify-page', etc.
   */
  redirect(route: InternalRoutes) {
    this.router.navigateByUrl('/' + route);
  }
}
