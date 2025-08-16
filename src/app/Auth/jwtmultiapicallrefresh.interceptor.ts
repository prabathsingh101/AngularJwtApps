//Interceptor with Queue + Dialog
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, switchMap, throwError } from 'rxjs';
import { RefreshPrompt } from '../popups/refresh-prompt/refresh-prompt';
import { MultiApiAuthService } from './auth-multiple-api-callsservice';

let dialogOpen = false; // ensure only one dialog at a time

export const jwtMultiApiRefreshTokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(MultiApiAuthService);
  const dialog = inject(MatDialog);

  // Attach token
  const token = authService.accessToken;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!dialogOpen) {
          dialogOpen = true;
          const dialogRef = dialog.open(RefreshPrompt, { disableClose: true });

          return dialogRef.afterClosed().pipe(
            switchMap((result) => {
              dialogOpen = false;

              if (result) {
                // user agreed → refresh
                return authService.refreshTokenRequest().pipe(
                  switchMap(() => {
                    // retry with new token
                    const updatedReq = req.clone({
                      setHeaders: {
                        Authorization: `Bearer ${authService.accessToken}`,
                      },
                    });
                    return next(updatedReq);
                  })
                );
              } else {
                authService.logout();
                return throwError(() => error);
              }
            })
          );
        } else {
          // If dialog is already open, just wait for refreshSubject
          return authService.refreshTokenRequest().pipe(
            switchMap(() => {
              const updatedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.accessToken}`,
                },
              });
              return next(updatedReq);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
