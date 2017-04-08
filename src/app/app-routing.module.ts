import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CoreComponent } from './core/core.component';

import { AuthHomeComponent } from './auth/auth-home/auth-home.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { SigninComponent } from './auth/signin/signin.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

import { HomeComponent } from './home/home.component';
import { FindMatchComponent } from './find-match/find-match.component';
import { TournamentsComponent } from './tournaments/tournaments.component';

import { MySportscenterComponent } from './my-sportscenter/my-sportscenter.component';
import { AddNewSportscenterComponent } from './add-new-sportscenter/add-new-sportscenter.component';
import { PitchComponent } from './pitch/pitch.component';
import { MatchCreateComponent } from './match-create/match-create.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {   path: 'auth',
                component: AuthComponent,
                children: [
                    { path: '', component: AuthHomeComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'login', component: SigninComponent },
                    { path: 'login/:activationid', component: SigninComponent },
                    { path: 'forgot-password', component: ForgotPasswordComponent },
                    { path: 'resetpassword/:resetid', component: ResetPasswordComponent },
                ],
            },
            {
                path: '',
                component: CoreComponent,
                children: [
                    { path: '', component: HomeComponent },
                    { path: 'home', component: HomeComponent },
                    { path: 'find-match', component: FindMatchComponent },
                    { path: 'tournaments', component: TournamentsComponent },
                    { path: 'my-sportscenter', component: MySportscenterComponent },
                    { path: 'add-new-sportscenter', component: AddNewSportscenterComponent },
                    { path: 'add-new-sportscenter/:updateId', component: AddNewSportscenterComponent },
                    { path: 'pitch/:scId', component: PitchComponent },
                    { path: 'match-create', component: MatchCreateComponent },
                ],
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
