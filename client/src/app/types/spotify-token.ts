export type SpotifyToken = {
  /** The access token used to authenticate API requests with Spotify. */
  access_token: string;

  /** The refresh token used to obtain a new access token when the current one expires. */
  refresh_token: string;

  /** The duration (in seconds) for which the access token is valid. */
  expires_in: number;
};


