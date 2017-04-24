import { CoreService } from './../../core/core.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
	styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, AfterViewInit {

	accountFormGroup: FormGroup;
	accountPasswordGroup: FormGroup;
	successmsg: string;
	errormsg: string;
	//fbId:any=false;
	sub: any;
	user:any;
	constructor(private fb: FormBuilder, private coreservice: CoreService, private route: ActivatedRoute, private router: Router) {

		 this.user = JSON.parse(window.localStorage['teem_user']);
		this.accountFormGroup = this.fb.group({
			email: ['', [Validators.required, Validators.email]]
		});

		this.accountPasswordGroup = this.fb.group({
			oldpassword: ['', [Validators.required,Validators.minLength(8)]],
			encryptedpassword: ['', [Validators.required, Validators.minLength(8)]],
			confirmpassword: ['', [Validators.required, Validators.minLength(8)]]
		}, { validator: this.matchingPasswords('encryptedpassword', 'confirmpassword') });

		this.sub = this.route.params.subscribe(params => {
			let activationcode = params['activationid']; // (+) converts string 'id' to a number

			if (activationcode) {
				this.coreservice.updateEmail(activationcode)
					.subscribe((response) => {

						this.errormsg = '';
						this.coreservice.emitSuccessMessage(response.data.message);
						//this.successmsg = response.data.message;
						window.localStorage['teem_user'] = JSON.stringify(response.data.data);

						this.accountFormGroup.patchValue({
							email: response.data.data.email
						});
						this.router.navigate(['']);

					},
					(error: any) => {
						//this.successmsg = '';
						//this.errormsg = error;
						this.coreservice.emitErrorMessage(error);
					});
			}
		});
	}

	ngOnInit() {
		
	}

	ngAfterViewInit() {
		
		this.accountFormGroup.patchValue({
			email: this.user.email
		});
		
		// if(user.fbid){
		// 	this.fbId=false;
		// }else{
		// 	this.fbId=true;
		// }
	}

	matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
		return (group: FormGroup): { [key: string]: any } => {
			let password = group.controls[passwordKey];
			let confirmPassword = group.controls[confirmPasswordKey];

			if (password.value !== confirmPassword.value) {
				return { mismatchedPasswords: true };
			}
		}
	}

	passwordSave() {
		let formVal = this.accountPasswordGroup.value;
		formVal.userid = JSON.parse(window.localStorage['teem_user']).id;

		this.coreservice.passwordUpdate(formVal)
			.subscribe(
			(result: any) => {
				this.coreservice.emitSuccessMessage(result);
				//this.successmsg = result;
				this.router.navigate(['']);
			},
			(error: any) => {
				//this.errormsg = error;
				this.coreservice.emitErrorMessage(error);
			}
			);
	}

	emailSave() {
		let formVal = this.accountFormGroup.value;
		formVal.userid = JSON.parse(window.localStorage['teem_user']).id;
		this.coreservice.changeEmail(formVal)
			.subscribe(
			(result: any) => {
				this.coreservice.emitSuccessMessage(result);
				//this.successmsg = result;
				this.router.navigate(['']);
			},
			(error: any) => {
				this.coreservice.emitErrorMessage(error);
				//this.errormsg = error;
			}
			);
	}

}
