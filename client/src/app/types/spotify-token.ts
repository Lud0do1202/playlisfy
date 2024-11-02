/**
 * Represents the token received from the Spotify API during authentication.
 */
export type SpotifyToken = {
  /**
   * The access token used to authenticate requests to the Spotify API.
   * This token typically has a limited lifespan and must be refreshed periodically.
   */
  access_token: string;

  /**
   * The refresh token that can be used to obtain a new access token 
   * without requiring the user to log in again. This token has an infinite
   * lifespan and can be used to refresh the access token.
   */
  refresh_token: string;

  /**
   * The duration in seconds until the access token expires. 
   * This value indicates how long the access token is valid before needing to be refreshed.
   */
  expires_in: number;
};

