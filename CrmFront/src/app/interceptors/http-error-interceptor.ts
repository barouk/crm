import {Router} from '@angular/router';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';



@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,private message: NzMessageService,) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          let errorMessage = '';
          if (err instanceof HttpErrorResponse) {
            // client-side error
            errorMessage = `Error: ${err.error.detail}`;
          } else {
            // server-side error
            errorMessage = `Error Code: ${err}\nMessage: ${err}`;
          }
          switch (err.status) {
            case 400:
              this.message.error('درخواست ارسال شده اشتباه است');
              break;
            case 401:
              this.router.navigateByUrl('/login');
              break;
            case 402:
              this.message.error('نام کاربری یا رمز عبور اشتباه است ');
              break;
            case 404:
              this.message.error('درخواست ارسال شده یافت نشد');
              break;
            case 500:
              this.message.error('خطا در پردازش اطلاعات');
              break;
            case 504:
              this.message.error('مشکل در اتصال به سرور');
              break;
            case 409:
              this.message.error('درخواست ارسال شده اشتباه است');
              break;
            case 502:
              this.message.error('مشکل در برقراری سرور');
              break;
            case 413:
              this.message.error('حجم فایل ارسال شده بیش از حد مجاز است');
              break;
            // route actions
            case 403:
                this.message.error('دسترسی غیرمجاز');
                this.router.navigateByUrl('/login');
              
              break;
            case 503:
              this.message.error('شما مجاز به انجام این کار نیستید.');
              break;
            default:
              return throwError(err);
          }
          return throwError(errorMessage);
        })
      );
  }


}
