import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please try again later.';
      } else if (error.status === 401) {
        // Check if it's login API
        if (req.url.includes('/auth/login')) {
          errorMessage = error.error?.message || 'Invalid username or password';
        } else {
          // Let JwtInterceptor handle refresh
          return throwError(() => error);
        }
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      // Show error in snackbar
      snackBar.open(`❌ ${errorMessage}`, 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error'],
      });

      // For global error handling we just propagate
      return throwError(() => error);
    })
  );
};
