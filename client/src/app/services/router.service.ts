import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InternalRoutes } from '../enums/internal-routes';

/**
 * Service responsible for handling route navigation within the application.
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
   */
  redirect = (route: InternalRoutes): void => {
    this.router.navigateByUrl('/' + route);
  }
}
