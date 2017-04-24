import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreService } from '../core/core.service';

import { MdDialog, MdDialogRef } from '@angular/material';

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

	selectedOption: string;

	constructor(private coreService: CoreService, private route: ActivatedRoute, private dialog: MdDialog) {
		this.loadSportCenters();
	}

	ngOnInit() {

	}

	loadSportCenters() {
		let user = JSON.parse(window.localStorage['teem_user']);
		let userid = user.id;
		this.coreService.getAllSportsCenter(userid)
			.subscribe((response) => {
				// console.log('received sports centers', response);
				this.sportCenters = response.data;
				//this.message = response.message;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// console.log(error);
				// this.error = error;
				// this._router.navigate(['/login']);
			});
	}

	deleteSportsCenter(id) {
		console.log(id);
		this.coreService.deleteSportsCenter(id)
			.subscribe((response) => {
				// console.log('delete sports center', response);
				// this.error = '';
				// this.success = response;
				this.coreService.emitSuccessMessage(response);
				this.loadSportCenters();
				//this.message = response.message;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// console.log(error);
				// this.success = '';
				// this.error = error;
				// this._router.navigate(['/login']);
			});
	}

	openDialog(id) {
		let dialogRef = this.dialog.open(DialogResult);
		dialogRef.afterClosed().subscribe(result => {
			// this.selectedOption = result;
			if ( result == 'Delete' ) {
				this.deleteSportsCenter(id);
				// console.log("Dialog result", this.selectedOption + " id = " + id);
			}
		});
	}

}


@Component({
	selector: 'dialog-result',
	template: `<h1 md-dialog-title>Delete</h1>
				<div md-dialog-content>are you sure?</div>
				<div md-dialog-actions>
				<button md-button (click)="dialogRef.close('Delete')">Delete</button>
				<button md-button (click)="dialogRef.close('Close')">Close</button>
				</div>`,
})
export class DialogResult {
	constructor(public dialogRef: MdDialogRef<DialogResult>) { }
}
