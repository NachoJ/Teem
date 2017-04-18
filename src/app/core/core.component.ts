import { environment } from './../../environments/environment';
import { CoreService } from './core.service';
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
	navMobileLinks: any;
	basketball: any;
	soccer: any;
	paddle: any;
	user: any;
	sport: any;
	profileImage: any;

	successmsg: string;
	errormsg: string;
	erroShow: boolean = false;
	successShow: boolean = false;

	constructor(private router: Router, private authService: AuthService, private coreservice: CoreService) {
		if (!authService.isLoggedIn()) {
			console.log("not looged in");
			this.router.navigate(['auth']);
		}

		let self = this;
		coreservice.successMessage$.subscribe(
            item => {
                self.successmsg = item;
                self.successShow = true;
                setTimeout(function() {
                    self.successShow = false;
                    self.successmsg = '';
                }, 3000);
            });

        coreservice.errorMessage$.subscribe(
            item => {
                self.errormsg = item;
                self.erroShow = true;
                setTimeout(function() {
                    self.erroShow = false;
                    self.errormsg = '';
                }, 3000);
            });

		this.user = JSON.parse(window.localStorage['teem_user'] || '' );
		if (this.user) {
			this.sport = this.user.sports;
			let sportkey = [];
			if (this.sport){

			 sportkey = this.sport.split(",");
			}

			let self = this;
			sportkey.forEach(function (index) {

				if (index == "basketball")
					self.basketball = true;

				if (index == "soccer")
					self.soccer = true;

				if (index == "paddle")
					self.paddle = true;

			});
		}
		if (this.user.profileimage != "")
			this.profileImage = environment.PROFILE_IMAGE_PATH + this.user.profileimage
		else
			this.profileImage = "/assets/img/sidebar_photo.png";

		this.coreservice.sportIcon$.subscribe(serviceResult => {

			if (serviceResult.key == "basketball")
				this.basketball = serviceResult.val;

			if (serviceResult.key == "soccer")
				this.soccer = serviceResult.val;

			if (serviceResult.key == "paddle")
				this.paddle = serviceResult.val;

			if (serviceResult.key == "all" && serviceResult.val == true) {
				this.basketball = true;
				this.soccer = true;
				this.paddle = true;
			}
			if (serviceResult.key == "all" && serviceResult.val == false) {
				this.basketball = false;
				this.soccer = false;
				this.paddle = false;
			}

		});

		this.coreservice.profileImage$.subscribe(resultImg => {
			this.profileImage = environment.PROFILE_IMAGE_PATH + resultImg;
		});

		this.coreservice.userEmit$.subscribe(userResult => {
			console.log("userResult", userResult);
			this.user = userResult;
		});

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


		this.navMobileLinks = [
			{
				title: "HOME",
				icon: "home",
				link: "/home"
			},
			{
				title: "CREATE MATCH",
				icon: "flag",
				link: "/match-create"
			},
			{
				title: "SEARCH MATCH",
				icon: "search",
				link: "/find-match"
			},
			{
				title: "TOURNMENTS",
				icon: "people",
				link: "/tournaments"
			},
			{
				title: "NOTIFICATION",
				icon: "email",
				link: "/home"
			},
			{
				title: "SETTINGS",
				icon: "settings",
				link: "/settings"
			},
			{
				title: "LOGOUT",
				icon: "exit_to_app",
				link: "/home"
			}
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
