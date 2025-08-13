import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  //debugger;
  const authService = inject(AuthService);
  // Retrieve the token from local storage
  // Note: Ensure the key matches what you set in your AuthService
  const token = localStorage.getItem('accessToken');

  console.log('JWT Interceptor: Token:', token);
  // If token exists, set it in the request headers
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = localStorage.getItem('accessToken');
            const cloned = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(cloned);
          }),
          catchError((err) => {
            authService.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
