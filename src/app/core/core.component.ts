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

	navLinks: any;

	constructor(private router: Router, private authService: AuthService) {
		if (!authService.isLoggedIn()) {
			console.log("not looged in");
			this.router.navigate(['auth']);
		}

		this.navLinks = [
			{
				title: "HOME",
				link: "/home"
			},
			{
				title: "FIND MATCH",
				link: "/find-match"
			},
			{
				title: "TOURNMENTS",
				link: "/tournaments"
			},
			{
				title: "My Sports Center",
				link: "/my-sportscenter"
			},
		];
	}


	ngOnInit() {
	}

	logout() {
		console.log('logout clicked');
		//   window.localStorage['teem_user'] = '';
		window.localStorage.removeItem['teem_user'];
		window.localStorage.clear();
		this.router.navigate(['/auth']);
	}

}
