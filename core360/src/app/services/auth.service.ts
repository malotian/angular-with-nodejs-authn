import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public isAuthenticated(): Boolean {
    let userData = localStorage.getItem('userInfo');
    if (userData && JSON.parse(userData)) {
      return true;
    }
    return false;
  }

  public setUserInfo(user: any) {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public async authenticate() {
    console.log('authenticate');
    const userInfo = this.http.post('/authn-handler/authenticate', {
      username: 'admin',
      password: 'admin',
    });
    
    this.setUserInfo(userInfo);
  }
}
