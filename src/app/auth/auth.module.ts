import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 

import { MaterialModule } from '@angular/material';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthHomeComponent } from './auth-home/auth-home.component';

import { AuthGuard } from "../auth/authguard.service";

@NgModule({
        imports: [
                BrowserModule,
                CommonModule,
                MaterialModule.forRoot(),
                RouterModule,
                FlexLayoutModule,
                ReactiveFormsModule
        ],
        declarations: [
                AuthComponent,
                RegisterComponent,
                SigninComponent,
                ForgotPasswordComponent,
                ResetPasswordComponent,
                AuthHomeComponent
        ],
        exports: [

        ],
        providers: [
                AuthService,
				AuthGuard
        ]
})
export class AuthModule { }
