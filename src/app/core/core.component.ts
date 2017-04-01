import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'app/auth/auth.service';

import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
	selector: 'te-core',
	templateUrl: './core.component.html',
	styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

	constructor(private router: Router, private authService: AuthService) {
		if (!authService.isLoggedIn()) {
			console.log("not looged in");
			this.router.navigate(['auth']);
		}
	}

	ngOnInit() {
	}

}
