import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Response } from '@angular/http';

import { AuthService } from '../auth.service';

@Component({
	selector: 'te-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	userName: string;
	password: string;
	email: string;
	error: string;
	success: string;

	public userRegisterFormGroup: FormGroup;

	constructor(private authService: AuthService, private formBuilder: FormBuilder) {
		this.userRegisterFormGroup = this.formBuilder.group({
			uname: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, Validators.minLength(8)]],
			email: ['', [Validators.required, Validators.email]]
		});
	}

	ngOnInit() {
	}

	registerUser() {
		/*console.log("username = " + this.userName);
		console.log("email = " + this.email);
		console.log("password = " + this.password);*/
		let user = {
			'username': this.userName,
			'email': this.email,
			'encryptedpassword': this.password
		};
		this.authService.registerUser(user)
			.subscribe(
			(res: any) => {

				console.log(res);
				this.error = '';
				this.success = res;
				this.userRegisterFormGroup.reset();

			},
			(error: any) => {
				console.log("RegisterComponent registeruser : " + error);
				this.success = '';
				this.error = error;
			});

	}

}
