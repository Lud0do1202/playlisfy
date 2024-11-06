
/**
 * All the keys used to store data in the local storage
 */
export enum LocalStorageKeys {
  /* --------------------------------- Spotify -------------------------------- */
  SpotifyAccessToken = 'SpotifyAccessToken',
  SpotifyRefreshToken = 'SpotifyRefreshToken',
  SpotifyTokenExpiresIn = 'SpotifyTokenExpiresIn',
  SpotifyTokenExpires = 'SpotifyTokenExpires',
  SpotifyAuthState = 'SpotifyAuthState',
  SpotifyAuthCodeVerifier = 'SpotifyAuthCodeVerifier',
  SpotifyAuthCodeChallenge = 'SpotifyAuthCodeChallenge',

  /* --------------------------------- Cyanite -------------------------------- */
  CyaniteAccessToken = 'CyaniteAccessToken',
  CyaniteRefreshToken = 'CyaniteRefreshToken',
  CyaniteTokenIat = 'CyaniteTokenIat',
  CyaniteTokenExp = 'CyaniteTokenExp',
}
