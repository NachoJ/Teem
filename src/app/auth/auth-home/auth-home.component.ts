import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { TranslateService } from "@ngx-translate/core";

declare const FB: any;

@Component({
	selector: 'te-auth-home',
	templateUrl: './auth-home.component.html',
	styleUrls: ['./auth-home.component.scss']
})
export class AuthHomeComponent implements OnInit {

	fbUserStatus: boolean = false;
	fbUserId: number;
	fbUserName: string;
	fbUserPhotoLink: string;
	fbUserEmail: string;
	fbUserPermissionGranted: boolean = false;
	fbToken: string;

	error: string;
	constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {
		FB.init({
			appId: '785727668257883', //main id 785727668257883  test app id 793209790843004
			cookie: true,  // enable cookies to allow the server to access the session
			xfbml: true,  // parse social plugins on this page
			version: 'v2.8' // use graph api version 2.8
		});
	}

	ngOnInit() {
	}

	callFbLogin() {
		let self = this;
		console.log("callFbLogin called");
		FB.login((result: any) => {
			console.log('login request', result);
			this.fbToken = result.authResponse.accessToken;
			FB.api('/me/permissions', (result: any) => {
				console.log('permissions', result);
				for (let i = 0; i < result.data.length; i++) {
					if (result.data[i].permission == 'email' && result.data[i].status == 'granted') {
						console.log('permission found')
						FB.api('/me', 'GET', { 'fields': 'id,name,first_name,last_name,email,picture.type(large),birthday,location' }, (result: any) => {
							console.log('get user data request', result);
							let data = {
								fbid: result.id,
								email: result.email,
								username: (result.first_name + result.last_name).toLowerCase(),
								profileimage: result.picture.data.url,
								firstname: result.first_name,
								lastname: result.last_name,
								dob: (result.birthday || ""),
								city: ""
							};
							if (result.location) {
								data.city = result.location.name;
							}
							console.log("data sent = ", data);
							this.authService.loginFbUser(data)
								.subscribe((response) => {
									console.log("dwl ", JSON.stringify(response))
									self.redirect(response);
									// this.error = response.message;
									// window.localStorage['teem_user'] = JSON.stringify(response.data);
									// this.router.navigate(['']);
								},
								(error: any) => {
									console.log("fb error", error)
									this.error = error;
								});
						});
					}
				}
			});
			// return this.fbUserStatus;
		}, { scope: 'email,public_profile,user_birthday,user_location', return_scopes: true, auth_type: 'rerequest' });
	}

	redirect(response) {
		var self = this;
		window.localStorage['teem_user'] = JSON.stringify(response.data);
		window.localStorage['teem_user_fblogin'] = true;
		self.ngZone.run(() => {
			this.router.navigate(['']);
		});
	}
	mfbLogout() {
		FB.logout((result: any) => {
			console.log(result);
		});
	}


}
