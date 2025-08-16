import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { RefreshPrompt } from '../popups/refresh-prompt/refresh-prompt';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);

  // Attach token if available
  const token = localStorage.getItem('accessToken');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // ✅ Only handle 401s from protected APIs, not from login/register
      const isAuthEndpoint =
        req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh');

      if (error.status === 401 && !isAuthEndpoint) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          // open dialog to confirm refresh
          const dialogRef = dialog.open(RefreshPrompt, {
            disableClose: true,
          });

          return dialogRef.afterClosed().pipe(
            switchMap((confirmed: boolean) => {
              if (confirmed) {
                return authService.refreshTokenRequest().pipe(
                  switchMap((tokens: any) => {
                    isRefreshing = false;
                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);
                    refreshTokenSubject.next(tokens.accessToken);

                    // retry request with new token
                    return next(
                      req.clone({
                        setHeaders: {
                          Authorization: `Bearer ${tokens.accessToken}`,
                        },
                      })
                    );
                  }),
                  catchError((err) => {
                    isRefreshing = false;
                    authService.logout();
                    return throwError(() => err);
                  })
                );
              } else {
                isRefreshing = false;
                authService.logout();
                return throwError(() => error);
              }
            })
          );
        } else {
          // wait for refresh to complete
          return refreshTokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) =>
              next(
                req.clone({
                  setHeaders: { Authorization: `Bearer ${token}` },
                })
              )
            )
          );
        }
      }

      // ❌ Wrong credentials or other error → just return
      return throwError(() => error);
    })
  );
};
