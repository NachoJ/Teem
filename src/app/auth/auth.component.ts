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
		this.translate.use(languageN);
		// this.translate.use('fr');
	}
	ngOnInit() {
	}

}
