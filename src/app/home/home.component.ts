import { environment } from './../../environments/environment';
import { CoreService } from './../core/core.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from "@angular/router";

declare var moment: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


	nextMatch: any[] = [];
	lastMatch: any[] = [];
	invitation: any[] = [];
	user: any;
	displayMatch: number = 3;
	displayLastMatch: number = 3;
	displayInvitationMatch: number = 3;
	isMore: boolean = true;
	isLastMore: boolean = true;
	isInvitationMore: boolean = true;

	currencySymbol = String.fromCharCode(36);
	EURSymbol = String.fromCharCode(8364);
	USDSymbol = String.fromCharCode(36);
	GBPSymbol = String.fromCharCode(163);
	SEKSymbol = String.fromCharCode(107) + String.fromCharCode(114);
	AUDSymbol = String.fromCharCode(36);

	constructor(private coreService: CoreService, private dialog: MdDialog, private router: Router, private zone: NgZone) {
		this.user = JSON.parse(window.localStorage['teem_user']);
		this.nextMatchList();
		this.invitationList();
		this.lastMatchList();
	}

	ngOnInit() { }

	nextMatchList() {

		this.coreService.getNextMatch(this.user.id, moment().format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				console.log("next match = ", response);
				this.nextMatch = [];
				// this.nearByMatch = response;
				for (let match of response) {
					//match["filteredMatchTime"] =  moment(match.matchdetail[0].matchtime, ['YYYY', moment.ISO_8601]).format('HH:mm');
					//console.log("time",moment(match.matchdetail[0].matchtime, ['YYYY', moment.ISO_8601]).format('HH:mm'));
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchdetail[0].matchtime);
					match['payment']="";
					this.nextMatch.push(match);
				}

				this.nextMatch.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

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

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.matchdetail[0].subsport[0].value = match.matchdetail[0].subsport[0].value + match.matchdetail[0].subsport[0].value;
					if(match.matchdetail[0].paymenttype=="free"){
						match['payment']="FREE";
					}else{
						match['payment']=this.currencyChanged(match.matchdetail[0].currency);
					}

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
				this.nextMatch = [];
			}
			);
	}

	invitationList() {
		console.log("date = ",  moment().format('YYYY-MM-DD 23:59:00'));
		this.coreService.getInvitation(this.user.id, moment().add(3,'h').format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				console.log("invite = ", response);
				this.invitation = [];
				// this.nearByMatch = response;
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchdetail[0].matchtime);
					match['payment']="";
					this.invitation.push(match);
				}
				this.invitation.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

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

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.matchdetail[0].subsport[0].value = match.matchdetail[0].subsport[0].value + match.matchdetail[0].subsport[0].value;
				
					if(match.matchdetail[0].paymenttype=="free"){
						match['payment']="FREE";
					}else{
						match['payment']=this.currencyChanged(match.matchdetail[0].currency);
					}

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
				console.log("error", this.invitation);
				this.invitation = [];
			}
			);

	}

	lastMatchList() {

		this.coreService.getLastMatch(this.user.id, moment().format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				console.log("next match = ", response);
				this.lastMatch = [];
				// this.nearByMatch = response;
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchdetail[0].matchtime);
					match['payment']="";
					this.lastMatch.push(match);
				}

				this.lastMatch.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";
				for (let match of this.lastMatch) {
					if (match.matchdetail[0].userdetail[0].profileimage != "")
						match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					else
						match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.matchdetail[0].subsport[0].value = match.matchdetail[0].subsport[0].value + match.matchdetail[0].subsport[0].value;

					if(match.matchdetail[0].paymenttype=="free"){
						match['payment']="FREE";
					}else{
						match['payment']=this.currencyChanged(match.matchdetail[0].currency);
					}

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
				console.log("lastMatch", this.lastMatch);
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				this.lastMatch = [];
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

	openAcceptDialog(id, matchId) {
		let dialogRef = this.dialog.open(HomeDialogResult);
		dialogRef.afterClosed().subscribe(result => {
			let self = this;
			// this.selectedOption = result;
			if (result == 'accept') {
				this.coreService.acceptInvitation(this.user.id, id).subscribe((result: any) => {
					this.coreService.emitSuccessMessage(result);
					this.router.navigate(['match-details/' + matchId]);
					// ----- redirecting to match detail page -----
					// setTimeout(function () {
					// 	self.zone.run(() => {
					// 		self.invitationList();
					// 		self.nextMatchList();
					// 	});
					// }, 2000);

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
	nextMoreMatch() {

		if (this.nextMatch.length <= this.displayMatch)
			this.displayMatch = 3;
		else
			this.displayMatch += 3;

		if (typeof this.nextMatch[this.displayMatch] == "undefined")
			this.isMore = false;
		else
			this.isMore = true;
	}

	lastMoreMatch() {
		if (this.lastMatch.length <= this.displayLastMatch)
			this.displayLastMatch = 3;
		else
			this.displayLastMatch += 3;

		if (typeof this.lastMatch[this.displayLastMatch] == "undefined")
			this.isLastMore = false;
		else
			this.isLastMore = true;
	}

	invitationMoreMatch() {
		if (this.invitation.length <= this.displayInvitationMatch)
			this.displayInvitationMatch = 3;
		else
			this.displayInvitationMatch += 3;

		if (typeof this.invitation[this.displayInvitationMatch] == "undefined")
			this.isInvitationMore = false;
		else
			this.isInvitationMore = true;
	}
	currencyChanged(currency) {
		if(currency=="eur")
			return this.EURSymbol;
		else if(currency=="usd")
			return this.USDSymbol;
		else if(currency=="gbp")
			return this.GBPSymbol;
		else if(currency=="sek")
			return this.SEKSymbol;
		else if(currency=="aud")
			return this.AUDSymbol;
		else 
			return this.AUDSymbol;	

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