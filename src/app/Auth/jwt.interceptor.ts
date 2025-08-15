import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RefreshPrompt } from '../popups/refresh-prompt/refresh-prompt';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  let isRefreshing = false;

  const refreshSubject = new BehaviorSubject<string | null>(null);

  const dialog = inject(MatDialog);

  const authService = inject(AuthService);

  const token = localStorage.getItem('accessToken');

  console.log('JWT Interceptor: Token:', token);

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          dialog.open(RefreshPrompt);
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = localStorage.getItem('accessToken');
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next(cloned);
            }),
            catchError((err) => {
              isRefreshing = false;
              dialog.closeAll();
              authService.logout();
              return throwError(() => err);
            })
          );
        } else {
          return refreshSubject.pipe(
            filter((token) => token != null),
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
      return throwError(() => error);
    })
  );
};
