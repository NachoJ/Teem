import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class SettingsComponent implements OnInit {
	navLinks: any = [];

	constructor() {
		this.navLinks = [
			{
				link: "profile",
				title: "SPROFILE"
			},
			{
				link: "notification",
				title: "NOTIFICATIONS"
			},
			{
				link: "account",
				title: "ACCOUNT"
			}

		]
	}
	ngOnInit() { }
}