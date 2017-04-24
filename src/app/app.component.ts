import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
	moduleId: module.id,
	selector: 'te-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	title = 'app works!';

	constructor(private translate: TranslateService) {
		this.loadLanguage();
	}
	loadLanguage() {
		console.log("language loaded app component");
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
}
