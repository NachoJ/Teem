// auth-guard.service.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate() {
        if (this.authService.isLoggedIn()) {
            return true;
        } else {
            // this.authService.logout();
            this.router.navigate(['auth']);
            return false;
        }
    }
}
