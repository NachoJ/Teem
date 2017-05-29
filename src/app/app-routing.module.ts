import { FollowingComponent } from './settings/following/following.component';
import { FollowersComponent } from './settings/followers/followers.component';
import { SportcenterViewComponent } from './sportcenter-view/sportcenter-view.component';
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
import { SearchComponent } from "./search/search.component";
import { ProfileViewComponent } from './profile-view/profile-view.component';


// import { AU } form '/auth/authguard.service';
import { AuthGuard } from "./auth/authguard.service";
import { ProfileGuard } from "app/core/profileguard.service";

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
				canActivate: [AuthGuard],
				children: [
					{ path: '', component: HomeComponent, canActivate: [ProfileGuard]},
					{ path: 'home', component: HomeComponent, canActivate: [ProfileGuard] },
					{ path: 'find-match', component: FindMatchComponent, canActivate: [ProfileGuard] },
					{ path: 'tournaments', component: TournamentsComponent, canActivate: [ProfileGuard] },
					{ path: 'my-sportscenter', component: MySportscenterComponent, canActivate: [ProfileGuard] },
					{ path: 'add-new-sportscenter', component: AddNewSportscenterComponent, canActivate: [ProfileGuard] },
					{ path: 'add-new-sportscenter/:updateId', component: AddNewSportscenterComponent, canActivate: [ProfileGuard] },
					{ path: 'pitch/:scId', component: PitchComponent, canActivate: [ProfileGuard] },
					{ path: 'pitch/:scId/:new', component: PitchComponent, canActivate: [ProfileGuard] },
					{ path: 'match-create', component: MatchCreateComponent, canActivate: [ProfileGuard] },
					{ path: 'match-create/:scId/:scName/:scAddress', component: MatchCreateComponent, canActivate: [ProfileGuard] },
					{ path: 'match-details/:matchId', component: MatchDetailsComponent, canActivate: [ProfileGuard] },
					{ path: 'search/:searchValue', component: SearchComponent, canActivate: [ProfileGuard] },
					{ path: 'profileview/:userId', component: ProfileViewComponent, canActivate: [ProfileGuard] },
					{ path: 'sportcenterview/:scId', component: SportcenterViewComponent, canActivate: [ProfileGuard] },
					{
						path: 'settings',
						component: SettingsComponent,
						children: [
							{ path: '', component: ProfileComponent },
							{ path: 'profile', component: ProfileComponent },
							{ path: 'account', component: AccountComponent },
							{ path: 'notification', component: NotificationComponent },
							{ path: 'email/:activationid', component: AccountComponent },
							{ path: 'followers', component: FollowersComponent },
							{ path: 'following', component: FollowingComponent },
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
