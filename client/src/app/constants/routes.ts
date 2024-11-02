/**
 * Defines a set of predefined application routes.
 *
 * This object maps descriptive route keys to their corresponding URL paths,
 * enabling consistent and centralized route management across the application.
 * 
 * Each key represents a route name, which is used to identify the route
 * in code, while the value is the actual URL path for navigation.
 *
 */
export const Routes = {
  'landing-page': '',
  'login-spotify-page': '/login/spotify',
  'login-spotify-callback-page': '/login/spotify/callback',
  'login-cyanite-page': '/login/cyanite',
  'playlists-page': '/playlists',
  'playlists-loading-page': '/playlists-loading',
} as const;

  
