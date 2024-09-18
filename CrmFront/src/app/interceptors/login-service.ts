import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { BehaviorSubject, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class AuthService {

  endpoint = '/api/v1/aaa/login/';


  
  access: any;
  refresh: any;
  public apiUrl = environment.apiUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);


  constructor(private http: HttpClient) {

    const token = localStorage.getItem('accessTokenDrs');
    this.loggedIn.next(!!token);
  }


  SignInApp1(value:any): Observable<any> {

    return this.http.post(`${this.apiUrl}${this.endpoint}`, value).pipe(
      tap((res: any) => {
        this.loggedIn.next(true);
        localStorage.setItem('refreshTokenDrs', res.refresh);
        localStorage.setItem('accessTokenDrs', res.access);
      })
    );
  }


  storeAccessToken = (token: string) => {
    localStorage.setItem('accessTokenDrs', token);
  }
  getAccessToken = () => {
    console.log("dddddddd")
    return localStorage.getItem('accessTokenDrs');
  }
  getRefreshToken = () => {
    return localStorage.getItem('refreshTokenDrs');
  }

}
