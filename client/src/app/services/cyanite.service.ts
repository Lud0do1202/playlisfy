import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { stored } from '../utils/stored';
import { LocalStorageKeys } from '../enums/local-storage-keys';
import { CyaniteToken } from '../types/cyanite-token';
import { Observable, of, tap } from 'rxjs';

/**
 * Service for handling Cyanite API authentication and token management.
 */
@Injectable({
  providedIn: 'root',
})
export class CyaniteService {
  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private http: HttpClient) {}

  /* -------------------------------------------------------------------------- */
  /*                                 ATTRIBUTES                                 */
  /* -------------------------------------------------------------------------- */
  /**
   * Object containing Cyanite authentication token information and related methods.
   */
  public token = {
    /**
     * The access token for Cyanite API authentication.
     */
    accessToken: stored(LocalStorageKeys.CyaniteAccessToken),

    /**
     * The refresh token used to obtain a new access token when the current one expires.
     */
    refreshToken: stored(LocalStorageKeys.CyaniteRefreshToken),

    /**
     * The issued at time of the token (date as a string).
     */
    iat: stored(LocalStorageKeys.CyaniteTokenIat),

    /**
     * The expiration time of the token (date as a string).
     */
    exp: stored(LocalStorageKeys.CyaniteTokenExp),

    /**
     * Checks if the current token is expired or will expire soon.
     * @returns {boolean} True if the token is expired or will expire within the next 60 minutes, false otherwise.
     */
    get soonExpired(): boolean {
      // If token is not set, it is considered expired
      if (!this.exp.value) return true;

      // Cast to Date
      const now = new Date();
      const expDate = new Date(this.exp.value);

      // If token is expired or will expire in less than 60 minutes
      const delay = 60;
      return expDate < now || expDate < new Date(now.getTime() + delay * 60 * 1000);
    },

    /**
     * Saves the provided Cyanite token information to the token object.
     * @param {CyaniteToken} token - The Cyanite token object containing new token information.
     */
    save: (token: CyaniteToken): void => {
      this.token.accessToken.value = token.accessToken;
      this.token.accessToken.value = token.accessToken;
      this.token.refreshToken.value = token.refreshToken;
      this.token.iat.value = token.iat;
      this.token.exp.value = token.exp;
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                   PUBLIC                                   */
  /* -------------------------------------------------------------------------- */
  /* ---------------------------------- Login --------------------------------- */
  /**
   * Attempts to log in to the Cyanite service.
   *
   * This method checks if the user is already logged in with a valid token.
   * If not, it sends a login request to the server to obtain a new Cyanite token.
   * Upon successful login, the new token is saved.
   *
   * @returns An Observable that emits:
   *          - null if the user is already logged in with a valid token
   *          - CyaniteToken if a new login is performed successfully
   *          The Observable completes after emitting the result.
   */
  public login = (): Observable<CyaniteToken | null> => {
    // Already logged in
    if (this.token.accessToken.value && !this.token.soonExpired) return of(null);

    // Login
    const url = `${environment.server.url}/cyanite/login`;
    return this.http.post<CyaniteToken>(url, {}).pipe(tap((token) => this.token.save(token)));
  };

  /* ------------------------------ Refresh Token ----------------------------- */
  /**
   * Refreshes the Cyanite authentication token.
   *
   * This method sends a POST request to the server to obtain a new Cyanite token
   * using the current refresh token. If successful, it updates the stored token
   * information with the newly received token.
   *
   * @returns An Observable that emits the new CyaniteToken upon successful token refresh.
   *          The Observable completes after emitting the token.
   */
  public refreshToken = (): Observable<CyaniteToken> => {
    const url = `${environment.server.url}/cyanite/refresh-token`;
    return this.http
      .post<CyaniteToken>(url, { refreshToken: this.token.refreshToken.value })
      .pipe(tap((token) => this.token.save(token)));
  };
}
