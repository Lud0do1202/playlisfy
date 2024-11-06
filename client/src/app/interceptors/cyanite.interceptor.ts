import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { mergeMap } from 'rxjs/operators';
import { CyaniteService } from '../services/cyanite.service';

/**
 * Interceptor for Cyanite requests
 * 
 * - If the token is expiring soon, it refreshes the token
 * - Set the access token in the request headers
 * 
 * @param req - The HTTP request object.
 * @param next - The next interceptor in the chain or the backend.
 * @returns The next HTTP request with the authorization token attached.
 */
export const cyaniteInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor if the request URL doesn't start with Cyanite's API endpoint
  if (!req.url.startsWith(environment.cyanite.api)) {
    return next(req);
  }

  // Inject the CyaniteService
  const cyaniteService = inject(CyaniteService);

  // Check if the token is expiring soon --> Refresh Token
  if (cyaniteService.token.soonExpired) {
    return cyaniteService.refreshToken().pipe(
      mergeMap((token) => {
        const requestWithToken = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token.accessToken || ''}`,
          },
        });
        return next(requestWithToken);
      })
    );
  }

  // If the token is not expiring, just add the current access token
  const accessToken = cyaniteService.token.accessToken.value;
  const requestWithToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken || ''}`,
    },
  });

  return next(requestWithToken);
};
