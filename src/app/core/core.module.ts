import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CoreComponent } from './core.component';

import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NavBarComponent } from './nav-bar/nav-bar.component';

import { CoreService } from './core.service';
import { ProfileGuard } from "app/core/profileguard.service";

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HttpModule, Http } from '@angular/http';

export function createTranslateLoader(http: Http) {
	return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MaterialModule.forRoot(),
		FlexLayoutModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [Http]
			}
		})
	],
	declarations: [
		CoreComponent,
		NavBarComponent,
	],
	exports: [

	],
	providers: [
		CoreService,
		ProfileGuard
	]
})
export class CoreModule { }
