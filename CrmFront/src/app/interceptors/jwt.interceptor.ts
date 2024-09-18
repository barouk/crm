import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import {catchError, switchMap, take} from 'rxjs/operators';
import { AuthService } from './login-service';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  refresh = false;

  constructor(private http: HttpClient, private tokenService: AuthService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();


    if (accessToken) {

      const req = request.clone({
        setHeaders: {
          authorization: `Bearer ${accessToken}`
        }
      });


      return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        
        console.log("wwwwwwwwwwww")
        if (err.status === 401 && !this.refresh) {
          this.refresh = true;
          const refreshToken = this.tokenService.getRefreshToken();
          return this.http.post('/api/token/refresh/', {refresh: refreshToken}).pipe(
            take(1),
            switchMap((token: any) => {
              const newAccessToken = token.access;
              this.tokenService.storeAccessToken(newAccessToken);
              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              }));
            }),
            catchError((e) => {
              console.log("wqqqqqqqqqq")
              return this.router.navigateByUrl('/login');
            })
          ) as Observable<HttpEvent<any>>;

        }
        this.refresh = false;
        return throwError(err);
      }));
    } else {
      console.log("pppp")
      this.router.navigateByUrl('/login');
    }
    return next.handle(request);
  }
}
