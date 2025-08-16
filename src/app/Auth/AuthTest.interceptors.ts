// import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
// import { AuthService } from './auth.service';
// import { MatDialog } from '@angular/material/dialog';
// import { inject } from '@angular/core';
// import { RefreshPrompt } from '../popups/refresh-prompt/refresh-prompt';
// import { catchError, from, switchMap, throwError } from 'rxjs';

// //no need i am using jwt.interceptors its backup code
// export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
//   const authService = inject(AuthService);
//   const dialog = inject(MatDialog);

//   // Attach access token
//   const token = authService.accessToken;
//   if (token) {
//     req = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//   }

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       if (error.status === 401) {
//         // open dialog
//         const dialogRef = dialog.open(RefreshPrompt, {
//           disableClose: true
//         });

//         return dialogRef.afterClosed().pipe(
//           switchMap(result => {
//             if (result) {
//               // user clicked Yes → refresh token
//               return authService.refreshTokenRequest().pipe(
//                 switchMap(newToken => {
//                   if (newToken) {
//                     // retry original request with new token
//                     const updatedReq = req.clone({
//                       setHeaders: { Authorization: `Bearer ${authService.accessToken}` }
//                     });
//                     return next(updatedReq);
//                   }
//                   authService.logout();
//                   return throwError(() => error);
//                 })
//               );
//             } else {
//               // user clicked No → logout
//               authService.logout();
//               return throwError(() => error);
//             }
//           })
//         );
//       }

//       return throwError(() => error);
//     })
//   );
// };

