import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
	selector: 'te-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

	email: string;
	forgotFormGroup: FormGroup;
	error: string;
	success: string;

	constructor(private authService: AuthService, private formBuilder: FormBuilder) {
		this.forgotFormGroup = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			/*password: ['', [Validators.required, Validators.minLength(3)]]
			uname: ['', [Validators.required, Validators.minLength(3)]],
			payment_address: ['', Validators.required],
			address: ['', Validators.required]*/
		});
	}

	ngOnInit() {
	}

	resetRequest() {
		console.log('email = ' + this.email);

		let userEmail = {
			'email': this.email,
		};
		this.authService.forgotPasswordRequest(userEmail)
			.subscribe((res: any) => {
				this.error = '';
				this.success = res;
				console.log("success", res);
			},
			(error: any) => {
				this.success = '';
				this.error = error;
				console.log("error", error);
				// this.message = error.json().error;
			});
	}

}
