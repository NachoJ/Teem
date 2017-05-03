import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
	selector: 'te-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

	constructor(private translate: TranslateService) {
		this.loadLanguage()
	}
	loadLanguage() {
		var arrLang = navigator.language.split('-');
		var languageN;
		if (arrLang.length > 0) {
			languageN = arrLang[0];
		} else {
			languageN = navigator.language;
		}
		console.log("language = " + languageN);
		this.translate.setDefaultLang('en');
		if (window.localStorage.getItem('teem_user_language'))
			this.translate.use(window.localStorage.getItem('teem_user_language'));
		else
			this.translate.use(languageN);
		// this.translate.use('es');
	}
	ngOnInit() {
	}

}
