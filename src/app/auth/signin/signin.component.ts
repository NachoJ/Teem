import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'te-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  email: string;
  password: string;
  error: string;
  success: string;

  sub: any;

  public userFormGroup: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.userFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
      /*email: ['', [Validators.required, Validators.pattern('[a-zA-Z\-0-9.]+@[a-zA-Z\-0-9]+.[a-zA-Z]{2,}')]],
      payment_address: ['', Validators.required],
      address: ['', Validators.required]*/
    });

    this.sub = this.route.params.subscribe(params => {
      let activationcode = params['activationid']; // (+) converts string 'id' to a number
      console.log(activationcode);

      //console.log("useractivation id > " + id);
      if (activationcode) {
        this.authService.activateUser(activationcode)
          .subscribe((response) => {

            // this._router.navigate(['/login']);
            console.log(response);
			this.error='';
            this.success = response;
          },
          (error: any) => {
			  this.success='';
            this.error = error;
            // this._router.navigate(['/login']);
          });
      }
    });

  }

  ngOnInit() {
  }

  userLogin() {
    // console.log("username = " + this.userName);
    // console.log("password = " + this.password);
    let user = {
      'email': this.email,
      'encryptedpassword': this.password
    };
    this.authService.login(user)
      .subscribe(
      (res: any) => {
          window.localStorage['teem_user'] = JSON.stringify(res.data.user);
          this.router.navigate(['']);
      },
      (error: any) => {
        console.log(error.error);
        this.error = error;
      });
  }

}
