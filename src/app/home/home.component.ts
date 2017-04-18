import { environment } from './../../environments/environment';
import { CoreService } from './../core/core.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

declare var moment: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


	nextMatch: any[] = [];
	invitation: any[] = [];
	user: any;
	constructor(private coreService: CoreService, private dialog: MdDialog, private zone: NgZone) {
		this.user = JSON.parse(window.localStorage['teem_user']);
		this.nextMatchList();
		this.invitationList();
	}

	ngOnInit() { }

	nextMatchList() {

		this.coreService.getNextMatch(this.user.id)
			.subscribe((response) => {
				console.log("next match = ", response);
				this.nextMatch = [];
				// this.nearByMatch = response;
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					this.nextMatch.push(match);
				}

				this.nextMatch.sort(function (a, b) {
					if (a.filteredMatchDate < b.filteredMatchDate) {
						return -1;
					}
					if (a.filteredMatchDate > b.filteredMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";
				for (let match of this.nextMatch) {
					if (match.matchdetail[0].userdetail[0].profileimage != "")
						match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					else
						match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
				console.log("nearByMatch", this.nextMatch);
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				this.nextMatch=[];
			}
			);
	}

	invitationList() {
		this.coreService.getInvitation(this.user.id)
			.subscribe((response) => {
				console.log("invite = ", response);
				this.invitation = [];
				// this.nearByMatch = response;
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					this.invitation.push(match);
				}
				this.invitation.sort(function (a, b) {
					if (a.filteredMatchDate < b.filteredMatchDate) {
						return -1;
					}
					if (a.filteredMatchDate > b.filteredMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";

				for (let match of this.invitation) {

					if (match.matchdetail[0].userdetail[0].profileimage != "")
						match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					else
						match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
				console.log("invitation", this.invitation);
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				console.log("error",this.invitation);
				this.invitation=[];
			}
			);

	}

	checkSport(index, value: string): boolean {
		if (index == 1 && value.includes('soccer')) {
			return true;
		}
		if (index == 2 && value.includes('basketball')) {
			return true;
		}
		if (index == 3 && value.includes('paddle')) {
			return true;
		}
		return false;
	}

	openAcceptDialog(id) {
		let dialogRef = this.dialog.open(HomeDialogResult);
		dialogRef.afterClosed().subscribe(result => {
			let self = this;
			// this.selectedOption = result;
			if (result == 'accept') {
				this.coreService.acceptInvitation(this.user.id,id).subscribe((result: any) => {
					this.coreService.emitSuccessMessage(result);
					setTimeout(function () {
						self.zone.run(() => {
							self.invitationList();
							self.nextMatchList();
						});
					}, 2000);

				},
					(error: any) => {
						this.coreService.emitErrorMessage(error);
					}
				)
			}
		});
	}

	openCancelDialog(id) {
		let dialogRef = this.dialog.open(HomeDialogCancel);
		dialogRef.afterClosed().subscribe(result => {
			let self = this;
			// this.selectedOption = result;
			if (result == 'accept') {
				this.coreService.deleteInvitation(id).subscribe((result: any) => {
					this.coreService.emitSuccessMessage(result);
					setTimeout(function () {
						self.zone.run(() => {
							self.invitationList();
							self.nextMatchList();
						});
					}, 2000);

				},
					(error: any) => {
						this.coreService.emitErrorMessage(error);
					}
				)
			}
		});
	}

}

@Component({
	selector: 'dialog-result',
	template: `<h6 md-dialog-title>Do you want to accept the invitation?</h6>
				<div md-dialog-actions>
				<button md-button (click)="dialogRef.close('accept')">Accept</button>
				<button md-button (click)="dialogRef.close('close')">Close</button>
				</div>`,
})
export class HomeDialogResult {
	constructor(public dialogRef: MdDialogRef<HomeDialogResult>) { }
}

@Component({
	selector: 'dialog-cancel',
	template: `<h6 md-dialog-title>Do you want to cancel the invitation?</h6>
				<div md-dialog-actions >
				<button md-button (click)="dialogRef.close('accept')">Accept</button>
				<button md-button (click)="dialogRef.close('close')">Close</button>
				</div>`,
})
export class HomeDialogCancel {
	constructor(public dialogRef: MdDialogRef<HomeDialogCancel>) { }
}