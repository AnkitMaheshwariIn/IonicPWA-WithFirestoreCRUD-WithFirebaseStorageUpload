import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  // the Router call canActivate() method,
  // if canActivate is registered in Routes[]
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // here we check if user is logged-in or not
    // the authService returs user object, or
    // it returns undefined/null when user is not logged-in

    return new Promise((resolve, reject) => {
      this.authService.user.subscribe((user) => {
        if (!user) {
          // when the user is not logged-in,
          // instead of just returning false
          // we can redirect to '/login' or any other view
          this.router.navigate(['/login'], {
            // note: this queryParams returns the current URL
            // that we can have in 'return' parameter,
            // so when the '/login' page opens,
            // this param tell us from where it comes
            queryParams: {
              return: state.url
            }
          });
          return resolve(false);
        } else {
          // just return true - if user is logged-in
          return resolve(true);
        }
      });
    });
  }
}
