import { SettingsComponent } from './settings/settings.component';
import { DatePickerDirective } from './shared/directive/datepicker.directive';
import { AccountComponent } from './settings/account/account.component';
import { UserProfileImageComponent } from './settings/user-profile-image/user-profile-image.component';
import { ProfileComponent } from './settings/profile/profile.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';

import { SharedModule } from './shared/shared.module';
import { HomeComponent,HomeDialogResult,HomeDialogCancel } from './home/home.component';
import { FindMatchComponent } from './find-match/find-match.component';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { AddNewSportscenterComponent } from './add-new-sportscenter/add-new-sportscenter.component';
import { MySportscenterComponent, DialogResult } from './my-sportscenter/my-sportscenter.component';
import { PitchComponent } from './pitch/pitch.component';
import { MatchCreateComponent } from './match-create/match-create.component';
import { MatchDetailsComponent, InvitationDialogResult } from './match-details/match-details.component';
import { NotificationComponent } from './settings/notification/notification.component';
// import { DialogResult } from './my-sportscenter/DialogResult';
import { DatepickerModule } from 'angular2-material-datepicker'

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpModule, Http } from '@angular/http';
import { SearchComponent } from './search/search.component';
import { ProfileViewComponent } from './profile-view/profile-view.component';
import { SportcenterViewComponent } from './sportcenter-view/sportcenter-view.component';
import { FollowersComponent } from './settings/followers/followers.component';
import { FollowingComponent } from './settings/following/following.component';

export function createTranslateLoader(http: Http) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		FindMatchComponent,
		TournamentsComponent,
		AddNewSportscenterComponent,
		MySportscenterComponent,
		PitchComponent,
		MatchCreateComponent,
		ProfileComponent,
		UserProfileImageComponent,
		AccountComponent,
		DatePickerDirective,
		DialogResult,
		MatchDetailsComponent,
		SettingsComponent,
		NotificationComponent,
		HomeDialogResult,
		HomeDialogCancel,
		InvitationDialogResult,
		SearchComponent,
		ProfileViewComponent,
		SportcenterViewComponent,
		FollowersComponent,
		FollowingComponent
	],
	entryComponents: [
		UserProfileImageComponent,
		DialogResult,
		HomeDialogResult,
		HomeDialogCancel,
		InvitationDialogResult
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		BrowserAnimationsModule,
		MaterialModule.forRoot(),
		FlexLayoutModule,
		DatepickerModule,
		AppRoutingModule,

		SharedModule.forRoot(),

		CoreModule,
		AuthModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [Http]
			}
		})
	],
	exports: [
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
