import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          this.updateTokenFromResponse(event);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // Retrieve the token from local storage
  private getToken(): string | null {
    const student = localStorage.getItem('Student');
    return student ? JSON.parse(student).token : null;
  }

  // Update the token if a new one is provided in the response
  private updateTokenFromResponse(response: HttpResponse<any>): void {
    const newToken = response.headers.get('Authorization')?.replace('Bearer ', '');
    if (newToken) {
      const student = JSON.parse(localStorage.getItem('Student')!);
      student.token = newToken;
      localStorage.setItem('Student', JSON.stringify(student));
    }
  }

  // Check if the token is expired
  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(new Date().getTime() / 1000);
    return payload.exp < currentTime;
  }

  // Handle errors globally
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401 || error.status === 403) {
      // Token is invalid or expired, redirect to login
      localStorage.removeItem('Student');
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }
}
