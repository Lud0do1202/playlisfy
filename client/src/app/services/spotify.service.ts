import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LocalStorageKeys } from '../enums/local-storage-keys';
import { SpotifyToken } from '../types/spotify-token';
import { stored } from '../utils/stored';
import { LoginError } from '../errors/login-error';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  /* -------------------------------------------------------------------------- */
  /*                                 CONSTRUCTOR                                */
  /* -------------------------------------------------------------------------- */
  constructor(private http: HttpClient) {}

  /* -------------------------------------------------------------------------- */
  /*                                  ATTIBUTES                                 */
  /* -------------------------------------------------------------------------- */
  /* --------------------------------- Spotify -------------------------------- */
  /**
   * Spotify API client ID.
   */
  private readonly clientId = environment.spotify.clientId;
  /**
   * URL to redirect the user to after Spotify login.
   */
  private readonly redirectUrl = environment.client.url;

  /**
   * Spotify API authorization endpoint.
   */
  private readonly authorizationEndpoint = 'https://accounts.spotify.com/authorize';

  /**
   * Spotify API token endpoint.
   */
  private readonly tokenEndpoint = 'https://accounts.spotify.com/api/token';

  /**
   * Spotify API scopes.
   */
  private readonly scope = 'user-read-private user-read-email';

  /* -------------------------------- Verifier -------------------------------- */
  /**
   * Verifier object to store state, code verifier, and code challenge.
   */
  private readonly verifier = {
    /**
     * State parameter for the Spotify authorization flow.
     */
    state: stored(LocalStorageKeys.SpotifyAuthState),

    /**
     * Code verifier for the Spotify authorization flow.
     */
    codeVerifier: stored(LocalStorageKeys.SpotifyAuthCodeVerifier),

    /**
     * Code challenge for the Spotify authorization flow.
     */
    codeChallenge: stored(LocalStorageKeys.SpotifyAuthCodeChallenge),
  };

  /* ---------------------------------- Token --------------------------------- */
  /**
   * Token object to store the access token, refresh token, and expiry information.
   */
  public readonly token = {
    /**
     * Spotify access token.
     */
    accessToken: stored(LocalStorageKeys.SpotifyAccessToken),

    /**
     * Spotify refresh token.
     */
    refreshToken: stored(LocalStorageKeys.SpotifyRefreshToken),

    /**
     * Access token expiry time in seconds.
     */
    expiresIn: stored(LocalStorageKeys.SpotifyTokenExpiresIn),

    /**
     * Access token expiry date.
     */
    expires: stored(LocalStorageKeys.SpotifyTokenExpires),

    /**
     * Checks if the access token is soon to expire.
     */
    get soonExpired(): boolean {
      if (!this.expires.value) return true;
      const expires = new Date(this.expires.value);
      const delay = 10; // Minutes
      const now = new Date();
      return expires < now || expires < new Date(now.getTime() + delay * 60 * 1000);
    },

    /**
     * Save the token to local storage.
     */
    save: (token: SpotifyToken): void => {
      // Save token to local storage
      this.token.accessToken.value = token.access_token;
      this.token.refreshToken.value = token.refresh_token;
      this.token.expiresIn.value = token.expires_in.toString();

      // Calculate expiry date
      const now = new Date();
      const expiry = new Date(now.getTime() + token.expires_in * 1000);
      this.token.expires.value = expiry.toISOString();
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                   PRIVATE                                  */
  /* -------------------------------------------------------------------------- */
  /* ------------------------- Generate Random String ------------------------- */
  /**
   * Generates a random string of the specified length using characters
   * from the defined character set. Utilizes the Web Crypto API for
   * secure random number generation.
   *
   * @param length - The length of the random string to generate.
   * @returns A randomly generated string.
   */
  private readonly generateRandomString = (length: number): string => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  };

  /* --------------------------------- SHA-256 -------------------------------- */
  /**
   * Computes the SHA-256 hash of the provided plain text string.
   * Returns a promise that resolves to an ArrayBuffer containing the hash.
   *
   * @param plain - The plain text string to hash.
   * @returns A promise that resolves to the SHA-256 hash as an ArrayBuffer.
   */
  private readonly sha256 = async (plain: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  /* ----------------------------- Base 64 Encode ----------------------------- */
  /**
   * Encodes the given ArrayBuffer into a Base64 URL-safe string.
   * The resulting string does not include padding characters.
   *
   * @param input - The ArrayBuffer to encode.
   * @returns A Base64 URL-safe encoded string.
   */
  private readonly base64encode = (input: ArrayBuffer): string => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  /* -------------------------------------------------------------------------- */
  /*                                   PUBLIC                                   */
  /* -------------------------------------------------------------------------- */
  /* ---------------------------------- Login --------------------------------- */
  /**
   * Handles the Spotify authentication process.
   *
   * This method performs three main tasks:
   * 1. If an authorization code is present, it attempts to retrieve an access token.
   * 2. If no access token is available, it initiates the Spotify login process.
   * 3. If an access token is already available, it returns the current token.
   *
   * @returns A Promise that resolves to the Spotify token object if authentication is successful,
   *          or null if the user is redirected to the Spotify login page.
   * @throws {LoginError} If there's an error during the authentication process.
   */
  public login = async () => {
    // Get params from URL
    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');
    const error = args.get('error');
    const state = args.get('state');

    // ---------- GET TOKEN ---------- //
    if (code || error) {
      // Error handling
      if (!state || state !== this.verifier.state.value || error || !code) {
        throw new LoginError('Could not log in to Spotify');
      }

      // Save token
      this.getToken(code).subscribe();
    }

    // ---------- SPOTIFY LOGIN ---------- //
    else if (!this.token.accessToken.value) {
      // Create a code challenge and a state
      const codeVerifier = this.generateRandomString(64);
      const hashed = await this.sha256(codeVerifier);
      const codeChallenge = this.base64encode(hashed);
      const state = this.generateRandomString(16);

      // Store those in local storage
      this.verifier.codeVerifier.value = codeVerifier;
      this.verifier.codeChallenge.value = codeChallenge;
      this.verifier.state.value = state;

      // Create parameters for the Spotify authorization URL
      const params = {
        response_type: 'code',
        client_id: this.clientId,
        state,
        scope: this.scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: this.redirectUrl,
      };

      // Create the URL
      const authUrl = new URL(this.authorizationEndpoint);
      authUrl.search = new URLSearchParams(params).toString();

      // Redirect the user to the Spotify authorization URL
      window.location.href = authUrl.toString();
      return null;
    }

    return this.token;
  };

  /* -------------------------------- Get Token ------------------------------- */
  /**
   * Exchanges an authorization code for a Spotify access token.
   * This method calls the Spotify token endpoint to obtain an access token and refresh token.
   *
   * @param code - The authorization code received from Spotify after user login.
   * @returns An observable that emits the Spotify token upon successful retrieval.
   * @throws {LoginError} If the code verifier is missing or there's an error during the authentication process.
   */
  public getToken = (code: string): Observable<SpotifyToken> => {
    // Get code verifier
    const code_verifier = this.verifier.codeVerifier.value;
    if (!code_verifier) {
      throw new LoginError('Could not log in to Spotify');
    }

    // Call the token endpoint
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUrl,
      code_verifier: code_verifier,
    });

    return this.http
      .post<SpotifyToken>(this.tokenEndpoint, body, { headers })
      .pipe(tap((token) => this.token.save(token)));
  };

  /* ------------------------------ Refresh Token ----------------------------- */
  /**
   * Refreshes the Spotify access token using the stored refresh token.
   * This method calls the Spotify token endpoint to obtain a new access token.
   *
   * @returns An observable that emits the new Spotify token upon successful retrieval.
   * @throws {LoginError} If the refresh token is missing or there's an error during the refresh process.
   */
  refreshToken = (): Observable<SpotifyToken> => {
    // Get refresh token
    const refreshToken = this.token.refreshToken.value;
    if (!refreshToken) {
      throw new LoginError('Could not refresh the access token');
    }

    // Call the token endpoint
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const body = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    return this.http
      .post<SpotifyToken>(this.tokenEndpoint, body, { headers })
      .pipe(tap((token) => this.token.save(token)));
  };
}
