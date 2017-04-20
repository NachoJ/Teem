import { NotificationComponent } from './settings/notification/notification.component';
import { SettingsComponent } from './settings/settings.component';
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
import { MatchDetailsComponent } from './match-details/match-details.component';
import { AccountComponent } from './settings/account/account.component';
import { ProfileComponent } from './settings/profile/profile.component';

// import { AU } form '/auth/authguard.service';
import { AuthGuard } from "./auth/authguard.service";

@NgModule({
	imports: [
		RouterModule.forRoot([
			{
				path: 'auth',
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
					{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
					{ path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
					{ path: 'find-match', component: FindMatchComponent },
					{ path: 'tournaments', component: TournamentsComponent },
					{ path: 'my-sportscenter', component: MySportscenterComponent },
					{ path: 'add-new-sportscenter', component: AddNewSportscenterComponent },
					{ path: 'add-new-sportscenter/:updateId', component: AddNewSportscenterComponent },
					{ path: 'pitch/:scId', component: PitchComponent },
					{ path: 'pitch/:scId/:new', component: PitchComponent },
					{ path: 'match-create', component: MatchCreateComponent },
					 {path: 'match-details/:matchId', component: MatchDetailsComponent },
					{ path: 'settings', 
					  component: SettingsComponent,
						children:[
							{ path: '', component: ProfileComponent},
							{ path: 'profile', component: ProfileComponent},
							{ path: 'account', component: AccountComponent },
							{ path: 'notification', component: NotificationComponent },
							{ path: 'email/:activationid', component: AccountComponent },		
						]		 
					},
				],
			}
		])
	],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
