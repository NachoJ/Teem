// auth-guard.service.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router, private authService: AuthService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		console.log("from auth guard");
		console.log("sub", state);
		console.log("route", route);

		if (this.authService.isLoggedIn()) {
			return true;
		} else {
			// this.authService.logout();
			if (state.url.includes("match-details/"))
				window.localStorage['teem_user_navigateto'] = state.url;
			this.router.navigate(['auth']);
			return false;
		}
	}
	// canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	// 	console.log("sub", state);
	// 	console.log("route", route);
	// 	return false;
	// }
}
