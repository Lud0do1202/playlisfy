/**
 * Defines a set of predefined application routes.
 *
 * This object maps descriptive route keys to their corresponding URL paths,
 * enabling consistent and centralized route management across the application.
 *
 * Each key represents a route name, which is used to identify the route
 * in code, while the value is the actual URL path for navigation.
 */
export enum InternalRoutes {
  LandingPage = '',
  LoginSpotifyPage = 'login/spotify',
  LoginSpotifyCallbackPage = 'login/spotify/callback',
  LoginCyanitePage = 'login/cyanite',
  PlaylistsPage = 'playlists',
  PlaylistsLoadingPage = 'playlists-loading',
}
