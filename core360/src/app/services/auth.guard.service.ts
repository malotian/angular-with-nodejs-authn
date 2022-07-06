import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// hardcoded user data.
const loggedInUser = {
 id: '1zx-casd123-asdzxc132',
 name: 'Lakindu Hewawasam',
 role: 'customer'
}

@Injectable({
 providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

 // inject the router service to allow navigation.
 constructor(private authService : AuthService, private router: Router) { }

 canActivate(
 route: ActivatedRouteSnapshot,
 state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
   const { role } = loggedInUser;
   
   // provides the route configuration options.
   const { routeConfig } = route; 
   
   // provides the path of the route.
   const { path } = routeConfig as Route; 
   
   if (path?.includes('admin') && role === 'admin') {
   // if user is administrator and is trying to access admin routes, allow access.

     return true;
   }
   
   if (path?.includes('customer') && role === 'customer') {
   // if user is customer and is accessing customer route, allow access.

     return true;
   }
    
   if ((path?.includes('guest') || path?.includes('home')) && (role === 'customer' || role === 'administrator')) {
   // if a logged in user goes to Guest or Home, navigate to their respective dashboard.

       this.router.navigateByUrl(role === 'customer' ? '/customer' : '/admin');
       return false;
   }
   
   // for any other condition, navigate to the forbidden route.

   this.router.navigateByUrl('/forbidden'); 
   return false;
 }
}