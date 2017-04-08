import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreService } from '../core/core.service';

@Component({
	selector: 'app-my-sportscenter',
	templateUrl: './my-sportscenter.component.html',
	styleUrls: ['./my-sportscenter.component.scss']
})
export class MySportscenterComponent implements OnInit {

	sportCenters: any;
	success: string;
	error: string;

	sub: any;

	constructor(private coreService: CoreService, private route: ActivatedRoute) {
		this.loadSportCenters();
	}

	ngOnInit() {

	}

	loadSportCenters() {
		this.coreService.getAllSportsCenter()
			.subscribe((response) => {
				// console.log('received sports centers', response);
				this.sportCenters = response.data;
				//this.message = response.message;
			},
			(error: any) => {
				console.log(error);
				this.error = error;
				// this._router.navigate(['/login']);
			});
	}

	deleteSportsCenter(id) {
		console.log(id);
		this.coreService.deleteSportsCenter(id)
			.subscribe((response) => {
				console.log('delete sports center', response);
				this.error = '';
				this.success = response;
				this.loadSportCenters();
				//this.message = response.message;
			},
			(error: any) => {
				console.log(error);
				this.success = '';
				this.error = error;
				// this._router.navigate(['/login']);
			});
	}

}
