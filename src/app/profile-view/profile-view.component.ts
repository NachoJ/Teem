import { MdIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../../environments/environment';
import { CoreService } from '../core/core.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var moment: any;

@Component({
	selector: 'te-profile-view',
	templateUrl: './profile-view.component.html',
	styleUrls: ['./profile-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileViewComponent implements OnInit {

	userDetails = <any>{};
	followers = <any>[];
	following = <any>[];
	scheduleMatch = <any>[];
	playedMatch = <any>[];
	organizedMatch = <any>[];
	profileUserId: any;
	profileImageBaseUrl: string;
	follow = true;
	isPadel = false;
	isSoccer = false;
	isBasketball = false;

	showFollowbtn = true;

	userId: any;

	isMobile = false;

	displayScheduleMatch: number = 3;
	isScheduleMore: boolean = true;

	displayPlayedMatch: number = 3;
	isPlayedMore: boolean = true;

	displayOrganizedMatch: number = 3;
	isOrganizedMore: boolean = true;

	currencySymbol = String.fromCharCode(36);
	EURSymbol = String.fromCharCode(8364);
	USDSymbol = String.fromCharCode(36);
	GBPSymbol = String.fromCharCode(163);
	SEKSymbol = String.fromCharCode(107) + String.fromCharCode(114);
	AUDSymbol = String.fromCharCode(36);

	constructor(private route: ActivatedRoute, private coreService: CoreService, private router: Router, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {

		this.userId = JSON.parse(window.localStorage['teem_user']).id;
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;

		// this.profileUserId = this.route.snapshot.params.userId;
		// this.loadUserData();
		// this.loadScheduleMatches();
		// this.loadPlayedMatch();
		// this.loadOrganizedMatches();
		this.route.params.subscribe(params => {
			this.profileUserId = params['userId'];
			this.loadUserData();
			this.loadScheduleMatches();
			this.loadPlayedMatch();
			this.loadOrganizedMatches();
		});

		iconRegistry.addSvgIcon(
			'all',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/all-sports_off.svg'));
		iconRegistry.addSvgIcon(
			'Soccer',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/futbol_off.svg'));
		iconRegistry.addSvgIcon(
			'Padel',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/padel_off.svg'));
		iconRegistry.addSvgIcon(
			'Basketball',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baloncesto_off.svg'));
	}

	loadUserData() {
		if (this.userId == this.profileUserId)
			this.showFollowbtn = false;
		if (this.profileUserId) {
			this.coreService.getUser(this.profileUserId)
				.subscribe((response) => {
					this.userDetails = response.data[0];
					this.userDetails.dob = moment(this.userDetails.dob).format('MMM DD, YYYY');
					this.followers = this.userDetails.followers;
					console.log("followers = ", this.followers);
					if (this.userDetails.sports.includes('padel') || this.userDetails.sports.includes('paddle'))
						this.isPadel = true;
					if (this.userDetails.sports.includes('soccer'))
						this.isSoccer = true;
					if (this.userDetails.sports.includes('basketball'))
						this.isBasketball = true;

					if (this.userDetails.followers[0].userdetail.length != 0)
						for (let follower of this.userDetails.followers) {
							if (follower.userdetail[0]._id == this.userId) {
								this.follow = false;
								break;
							}
						}
					// ------------ alternate method ------------
					// let self = this;
					// if (this.userDetails.followers[0].userdetail.filter(function (obj) {
					// 	return obj._id === self.userId;
					// })[0]) {
					// 	this.follow = false;
					// }
					this.coreService.getFollowing(this.profileUserId)
						.subscribe((result: any) => {
							this.following = result.data;
						},
						(error: any) => {
							this.coreService.emitErrorMessage(error);
						});
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
				});
		}

	}

	ngOnInit() {
		if (navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
		) {
			this.isMobile = true;
		}
	}
	loadScheduleMatches() {
		this.coreService.getNextMatch(this.profileUserId, moment().format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				this.scheduleMatch = [];
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchdetail[0].matchtime);
					match['payment'] = "";
					this.scheduleMatch.push(match);
				}

				this.scheduleMatch.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";
				for (let match of this.scheduleMatch) {
					if (match.matchdetail[0].userdetail[0].profileimage != "")
						match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					else
						match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.matchdetail[0].subsport[0].value = match.matchdetail[0].subsport[0].value + match.matchdetail[0].subsport[0].value;
					if (match.matchdetail[0].paymenttype == "free") {
						match['payment'] = "FREE";
					} else {
						match['payment'] = this.currencyChanged(match.matchdetail[0].currency);
					}

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				this.scheduleMatch = [];
			});
	}

	loadPlayedMatch() {
		this.coreService.getPlayedMatches(this.profileUserId, moment().format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				this.playedMatch = [];
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchdetail[0].matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchdetail[0].matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchdetail[0].matchtime);
					match['payment'] = "";
					this.playedMatch.push(match);
				}

				this.playedMatch.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";
				for (let match of this.playedMatch) {
					if (match.matchdetail[0].userdetail[0].profileimage != "")
						match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					else
						match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.matchdetail[0].subsport[0].value = match.matchdetail[0].subsport[0].value + match.matchdetail[0].subsport[0].value;
					if (match.matchdetail[0].paymenttype == "free") {
						match['payment'] = "FREE";
					} else {
						match['payment'] = this.currencyChanged(match.matchdetail[0].currency);
					}

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				this.playedMatch = [];
			});
	}

	loadOrganizedMatches() {
		this.coreService.getOrganizedMatches(this.profileUserId, moment().format('YYYY-MM-DD HH:mm.Z'))
			.subscribe((response) => {
				console.log("ORganized", response);
				this.organizedMatch = [];
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchtime).format('MMM DD, YYYY');
					match["compareMatchDate"] = new Date(match.matchtime);
					match['payment'] = "";
					this.organizedMatch.push(match);
				}

				this.organizedMatch.sort(function (a, b) {
					if (a.compareMatchDate < b.compareMatchDate) {
						return -1;
					}
					if (a.compareMatchDate > b.compareMatchDate) {

						return 1;
					}
					return 0;
				});

				let dateToCheck: string = "";
				for (let match of this.organizedMatch) {
					// if (match.matchdetail[0].userdetail[0].profileimage != "")
					// 	match.matchdetail[0].userdetail[0].profileimage = environment.PROFILE_IMAGE_PATH + match.matchdetail[0].userdetail[0].profileimage;
					// else
					// 	match.matchdetail[0].userdetail[0].profileimage = "../../assets/img/sidebar_photo.png";

					//match.matchdetail[0].benchplayers = match.matchdetail[0].benchplayers + match.matchdetail[0].benchplayers;
					match.subsport[0].value = match.subsport[0].value + match.subsport[0].value;
					if (match.paymenttype == "free") {
						match['payment'] = "FREE";
					} else {
						match['payment'] = this.currencyChanged(match.currency);
					}

					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
			},
			(error) => {
				this.coreService.emitErrorMessage(error);
				this.organizedMatch = [];
			});
	}

	followUser() {
		this.coreService.followUser(this.userId, this.profileUserId)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				this.follow = false;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	unFollowUser() {
		// console.log("unfollow clicked");
		this.coreService.unFollowUser(this.userId, this.profileUserId)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				this.follow = true;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	navigateToUserProfile(uid) {
		// console.log(uid);
		this.router.navigate(['profileview', uid]);
	}

	scheduleMoreMatch() {

		if (this.scheduleMatch.length <= this.displayScheduleMatch)
			this.displayScheduleMatch = 3;
		else
			this.displayScheduleMatch += 3;

		if (typeof this.scheduleMatch[this.displayScheduleMatch] == "undefined")
			this.isScheduleMore = false;
		else
			this.isScheduleMore = true;
	}

	playedMoreMatch() {

		if (this.playedMatch.length <= this.displayPlayedMatch)
			this.displayPlayedMatch = 3;
		else
			this.displayPlayedMatch += 3;

		if (typeof this.playedMatch[this.displayPlayedMatch] == "undefined")
			this.isPlayedMore = false;
		else
			this.isPlayedMore = true;
	}

	organizedMoreMatch() {

		if (this.organizedMatch.length <= this.displayOrganizedMatch)
			this.displayOrganizedMatch = 3;
		else
			this.displayOrganizedMatch += 3;

		if (typeof this.organizedMatch[this.displayOrganizedMatch] == "undefined")
			this.isOrganizedMore = false;
		else
			this.isOrganizedMore = true;
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

	currencyChanged(currency) {
		if (currency == "eur")
			return this.EURSymbol;
		else if (currency == "usd")
			return this.USDSymbol;
		else if (currency == "gbp")
			return this.GBPSymbol;
		else if (currency == "sek")
			return this.SEKSymbol;
		else if (currency == "aud")
			return this.AUDSymbol;
		else
			return this.AUDSymbol;

	}

}
