import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {


  resetid: string;
  newPassword: string;
  confirmPassword: string;
  error: string;
  success:string;

  public resetPasswordFormGroup: FormGroup;

  // newpasswordCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private route: ActivatedRoute, private router: Router) {

    this.resetid = this.route.snapshot.params['resetid'];
    this.resetPasswordFormGroup = this.formBuilder.group({
      newpassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]]
    },
      { validator: this.matchingPasswords('newpassword', 'confirmpassword') }
    );
  }

  ngOnInit() {
    console.log(this.newPassword)
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  resetPassword() {

    this.authService.resetPasswordRequest(this.resetid, this.newPassword)
      .subscribe((res: any) => {

        // window.localStorage['teem_user'] = JSON.stringify(res.data.user);
        // this.router.navigate(['']);
		this.error='';
        this.success = res;
        this.resetPasswordFormGroup.reset();

      },
      (error: any) => {
        console.log("resetPassword error ", error);
		this.success='';
        this.error = error.error;
      });
  }
}
