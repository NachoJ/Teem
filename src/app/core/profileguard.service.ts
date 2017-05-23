import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { CoreService } from "app/core/core.service";


@Injectable()
export class ProfileGuard implements CanActivate {

	constructor(private router: Router, private authService: AuthService, private coreService: CoreService) { }

	canActivate() {
		if (this.authService.isProfileFilled()) {
			return true;
		} else {
			// this.authService.logout();
			// alert('test');
			this.router.navigate(['settings'], { queryParams: { new: "profile" }} );
			this.coreService.emitSuccessMessage("Please Fill Full Profile");
			console.log("profile guard = ", "else");
			return false;
		}
	}
}
