import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { mergeMap } from 'rxjs/operators';
import { SpotifyService } from '../services/spotify.service';

/**
 * Interceptor to add the Spotify authorization token to requests.
 * 
 * This interceptor checks if the request is targeting the Spotify API and
 * adds the appropriate access token to the request headers. If the token 
 * is close to expiring, it attempts to refresh it before making the request.
 * 
 * @param req - The HTTP request object.
 * @param next - The next interceptor in the chain or the backend.
 * @returns The next HTTP request with the authorization token attached.
 */
export const spotifyInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor if the request URL doesn't start with Spotify's API endpoint
  if (!req.url.startsWith(environment.spotify.api)) {
    return next(req);
  }

  // Inject the SpotifyService
  const spotifyService = inject(SpotifyService);

  // Check if the token is expiring soon --> Refresh Token
  if (spotifyService.token.soonExpired) {
    return spotifyService.refreshToken().pipe(
      mergeMap((token) => {
        const requestWithToken = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.access_token}`,
          },
        });
        return next(requestWithToken);
      })
    );
  }

  // If the token is not expiring, just add the current access token
  const accessToken = spotifyService.token.accessToken.value;
  const requestWithToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken || ''}`,
    },
  });

  return next(requestWithToken);
};
