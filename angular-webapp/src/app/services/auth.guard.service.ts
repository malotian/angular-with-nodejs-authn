import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}

  async canActivate() {
    
    if (!this.authService.isAuthenticated()) {
      await this.authService.authenticate();
    }

    return this.authService.isAuthenticated() ? true : false;
  }
}
