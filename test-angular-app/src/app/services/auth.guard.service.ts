import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}

  async canActivate() {

    let res = await this.authService.isAuthenticated()
    
    if (!res) {
      this.authService.authenticate();
    }

    return await this.authService.isAuthenticated() ? true : false;
  }
}
