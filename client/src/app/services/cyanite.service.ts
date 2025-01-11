import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { stored } from '../utils/stored';
import { LocalStorageKeys } from '../enums/local-storage-keys';
import { CyaniteToken } from '../types/cyanite-token';
import { Observable, of, tap } from 'rxjs';
import { CyaniteTrack } from '../types/cyanite-track';
import { wait } from '../utils/promise';

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

  /* ------------------------------- Get Track ------------------------------- */
  /**
   *
   * @param memo
   * @param handleError409
   * @returns
   */
  public getTracks = async (ids: string[]): Promise<CyaniteTrack[]> => {
    // URL
    const url = `${environment.server.url}/cyanite/tracks`;

    // Call
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token.accessToken.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }), // Serialize the body to JSON
    });

    // Tracks
    const tracks: CyaniteTrack[] = await response.json();
    return tracks;
  };

  /* ----------------------------- Get All Tracks ----------------------------- */
  public getAllTracks = async (ids: string[]): Promise<CyaniteTrack[]> => {
    // Predicates
    const isSuccessful = (track: CyaniteTrack) => track.success;
    const isOverload = (track: CyaniteTrack) => track.error === 'OVERLOAD';
    const isAlreadyEnqueued = (track: CyaniteTrack) => track.error === 'ALREADY_ENQUEUED';
    const isNotAnalysed = (track: CyaniteTrack) => track.error === 'WAS_NOT_ANALYZED';
    const isEnqueueFailed = (track: CyaniteTrack) => track.error === 'ENQUEUE_FAILED';

    // Get the tracks the first time
    const tracks = await this.getTracks(ids);
    const success = tracks.filter(isSuccessful);
    const enqueuedFailed = tracks.filter(isEnqueueFailed);
    let failed = tracks.filter((track) => isOverload(track) || isNotAnalysed(track) || isAlreadyEnqueued(track));

    // Retry the not analysed ones
    const MAX_ATTEMPTS = 20;
    const DELAY_RETRY = 500;
    for (let attempt = 0; attempt < MAX_ATTEMPTS && failed.length > 5; attempt++) {
      // Delay
      await wait(DELAY_RETRY);

      // Get tracks
      const retryIds = failed.map((track) => track.id);
      const retryTracks = await this.getTracks(retryIds);
      const retrySuccess = retryTracks.filter(isSuccessful);
      const retryFailed = retryTracks.filter(
        (track) => isOverload(track) || isNotAnalysed(track) || isAlreadyEnqueued(track)
      );
      const retryEnqueuedFailed = retryTracks.filter(isEnqueueFailed);

      // Update results
      success.push(...retrySuccess);
      failed = retryFailed;
      enqueuedFailed.push(...retryEnqueuedFailed);
    }

    // RETURN
    return success;
  };
}
