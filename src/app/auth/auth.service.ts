import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NgZone } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
// import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/do';  // debug

import { environment } from '../../environments/environment';

declare const FB: any;

@Injectable()
export class AuthService {

	headers: Headers;
	options: RequestOptions;

	fbUserStatus: boolean = false;
	fbUserId: number;
	fbUserName: string;
	fbUserPhotoLink: string;
	fbUserEmail: string;
	fbUserPermissionGranted: boolean = false;
	fbToken: string;

	constructor(private http: Http, private zone: NgZone) {
		//this.headers = new Headers({ 'Authorization': 'Basic dmlld2Zvb3VzZXI6MjMzMXNkNTZhNDU2czNkMTRhczY=' });
		//this.headers.append('Content-Type', 'application/json');
		this.headers = new Headers({ 'Content-Type': 'application/json' });
		this.options = new RequestOptions({ headers: this.headers });
	}

	// Function for parameter of post
	// getKeyPairValue(param) {
	//     let formBody: any;
	//     for (let property in param) {
	//         let encodedKey = encodeURIComponent(property);
	//         let encodedValue = encodeURIComponent(param[property]);
	//         formBody.push(encodedKey + "=" + encodedValue);
	//     }
	//     formBody = formBody.join('&');
	//     return formBody;
	// }

	isLoggedIn() {
		let user = (window.localStorage['teem_user']);
		// console.log(user);
		if (user) {
			return true;
		}
		return false;
	}

	registerUser(user) {
		let data = JSON.stringify(user);

		return this.http.post(environment.BASEAPI + environment.REGISTER_USER, data, this.options)
			.map((res: Response) => {
				return res.json().message;

			}).catch(this.handleError);
		// .do(data => console.log('server data:', data))  // debug
	}

	login(user) {
		let data = JSON.stringify(user);

		return this.http.post(environment.BASEAPI + environment.LOGIN_USER, data, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
	}

	activateUser(code: string) {
		// console.log('activateUser called');
		let data = {
			activationlink: code
		};

		return this.http.post(environment.BASEAPI + environment.ACTIVATE_USER, data, this.options)
			.map((res: Response) => {
				// console.log(res);
				return res.json().message;

			}).catch(this.handleError);
	}

	loginFbUser(info) {

		console.log("register fb user");

		let data = JSON.stringify(info);

		return this.http.post(environment.BASEAPI + environment.LOGIN_FB_USER, data, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
	}

	// fbLogout() {
	//     console.log('logout service called and status');
	//     // FB.logout((result: any) => {
	//     //     console.log(result);
	//     // });

	// }

	forgotPasswordRequest(email) {
		// console.log('forgotPasswordRequest called');
		let data = JSON.stringify(email);

		return this.http.post(environment.BASEAPI + environment.FORGOT_PASSWORD, data, this.options)
			.map((res: Response) => {
				// console.log(res);
				return res.json().message;

			}).catch(this.handleError);
	}

	resetPasswordRequest(resetlink: string, password: string) {
		// console.log('forgotPasswordRequest called');
		let data = JSON.stringify({
			resetlink: resetlink,
			password: password
		});

		return this.http.post(environment.BASEAPI + environment.RESET_PASSWORD, data, this.options)
			.map((res: Response) => {
				// console.log(res);
				return res.json().message;

			}).catch(this.handleError);
	}

	isProfileFilled() {
		let user = JSON.parse(window.localStorage['teem_user'] || {});
		// console.log(user);
		if (user) {
			if (user.dob && user.city && user.sports && user.firstname && user.lastname) {
				return true;
			}
		}
		return false;
	}

	handleError(error: any) {
		return Observable.throw(error.json().error || 'Server error');
	}


}
