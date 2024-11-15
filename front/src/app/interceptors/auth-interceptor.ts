import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('AuthInterceptor triggered');
    if (token) {
      // Clone the request and add the Authorization header with the JWT token
      const clonedRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          // If the token is expired or invalid, handle it here
          if (error.status === 401 || error.status === 403) {
            // Redirect to login if not authorized
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    } else {
      // No token found, redirect to login page
      this.router.navigate(['/login']);
      return throwError('No token found');
    }
  }
}
