// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../service/auth.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   constructor(private authService: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
    
//     let newReq= req;
//     let token=this.authService.getToken()

//     console.log("intercept");

//     if(token!=null){
//      newReq= newReq.clone({setHeaders:{Authorization:`Bearer ${token}`}})
//     }
//     return next.handle(newReq)
    
//   }
// }


import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newReq = req;
    let token = this.authService.getToken();

    console.log("🔄 Intercepting Request...");

    if (token) {
      newReq = newReq.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(newReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log("⚠️ Token expired! Refreshing...");

          return this.authService.refreshAccessToken().pipe(
            switchMap((response: any) => {
              this.authService.storeTokens(response.jwtToken, this.authService.getRefreshToken()!);

              // 🔄 Retry request with new token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${response.jwtToken}` }
              });

              return next.handle(retryReq);
            }),
            catchError(() => {
              console.log("❌ Refresh token expired! Logging out...");
              this.authService.logout();
              return throwError(() => new Error('Session Expired. Please login again.'));
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
