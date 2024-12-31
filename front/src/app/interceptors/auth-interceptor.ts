import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor triggered');
  
  // Clone the request and add the Authorization header
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer your-token`, // Replace with your actual token logic
    },
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      // Check for 401 Unauthorized status
      if (error.status === 401) {
        console.error('Unauthorized access detected. Redirecting to /welcome.html');
        // Redirect to /welcome.html
        window.location.href = '/welcome.html';
      }
      
      // Re-throw the error for other status codes
      return of(error);
    })
  );
};
