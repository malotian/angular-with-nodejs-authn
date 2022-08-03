import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { interval, take, lastValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  public async isAuthenticated(): Promise<Boolean> {
    let userInfo = lastValueFrom(this.http.get('/authn-handler/saml/me'));
    this.updateUserInfo(await userInfo);
    return this.hasUserInfo();
  }

  public hasUserInfo() {
    let userData = localStorage.getItem('userInfo');
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  public updateUserInfo(user: any) {
    if (undefined === user) {
      localStorage.removeItem('userInfo');
      return;
    }
    console.log('setUserInfo.userInfo: ' + JSON.stringify(user));
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public authenticate() {
    this.router.navigate(['login'], {
      state: { relayState: window.location.href },
    });
  }
}
