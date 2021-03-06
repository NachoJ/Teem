import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { TranslateService } from "@ngx-translate/core";

import { environment } from './../../../environments/environment';

declare const FB: any;
declare const $: any;

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
	fbOAuthUrl: string;

	showSpinner = false;

	error: string;
	constructor(private authService: AuthService, private router: Router, private ngZone: NgZone, private route: ActivatedRoute) {
		this.fbOAuthUrl = 'https://www.facebook.com/v2.8/dialog/oauth?' +
			'client_id=' + environment.FACEBOOK_API_KEY +
			'&redirect_uri=' + environment.LOCAL_ADDRESS + '/auth' +
			'&auth_type=rerequest' +
			'&scope=email,public_profile,user_birthday,user_location' +
			'&response_type=token';

		FB.init({
			appId: environment.FACEBOOK_API_KEY, //main id 785727668257883  test app id 793209790843004
			cookie: true,  // enable cookies to allow the server to access the session
			xfbml: true,  // parse social plugins on this page
			version: 'v2.8' // use graph api version 2.8
		});
	}

	ngOnInit() {
		var self = this;
		this.fbToken = self.route.snapshot.fragment;
		$(document).ready(function () {
			console.log("ready");
			// tslint:disable-next-line:curly
			if (self.fbToken)
				if (self.fbToken.includes('access_token')) {
					console.log('FbToken found');
					self.showSpinner = true;
					setTimeout(function () {
						self.callFbLogin();
					}, 1000);
				}
		});
	}

	callFbLoginOAuth() {
		window.location.href = this.fbOAuthUrl;

	}

	callFbLogin() {
		let self = this;
		var isPermissionGranted = false;
		console.log("callFbLogin called");
		// FB.login((result: any) => {
		// 	console.log('login request', result);
		// 	this.fbToken = result.authResponse.accessToken;
		FB.api('/me/permissions', (result: any) => {
			console.log('permissions', result);
			for (let i = 0; i < result.data.length; i++) {
				if (result.data[i].permission == 'email' && result.data[i].status == 'granted') {
					isPermissionGranted = true;
					console.log('permission found')
					FB.api('/me', 'GET', { 'fields': 'id,name,first_name,last_name,email,picture.type(large),birthday,location' }, (result: any) => {
						let data = {
							fbid: result.id,
							email: result.email,
							username: (result.first_name + result.last_name).toLowerCase(),
							profileimage: result.picture.data.url,
							firstname: result.first_name,
							lastname: result.last_name,
							dob: (result.birthday || ""),
							city: (result.location || "")
						};
						console.log('get user data request', result);
						if (result.location) {
							data.city = result.location.name;
						}
						console.log("data sent = ", data);
						this.authService.loginFbUser(data)
							.subscribe((response) => {
								self.redirect(response);
								// this.error = response.message;
								// window.localStorage['teem_user'] = JSON.stringify(response.data);
								// this.router.navigate(['']);
							},
							(error: any) => {
								console.log("fb error", error)
								this.error = error;
								self.ngZone.run(() => {
									self.showSpinner = false;
								});
							});
					});
				}
			}
			if (!isPermissionGranted) {
				alert("Please login again and allow required permissions");
				self.ngZone.run(() => {
					self.showSpinner = false;
				});
			}
			console.log("self.showSpinner = ", this.showSpinner);
		}, { scope: 'email,public_profile,user_birthday,user_location', return_scopes: true, auth_type: 'rerequest' });
		// return this.fbUserStatus;
		// }, { scope: 'email,public_profile,user_birthday,user_location', return_scopes: true, auth_type: 'rerequest' });
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

	checkLoginState() {
		console.log("user logged in");
	}


}
