import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../core/core.service';
import { environment } from "../../environments/environment";

declare var moment: any;
declare var google: any;

@Component({
	selector: 'app-match-details',
	templateUrl: './match-details.component.html',
	styleUrls: ['./match-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MatchDetailsComponent implements OnInit {

	match: any;
	sub: any;
	team1: any[] = [];
	team2: any[] = [];
	team1player: any[] = [];
	team2player: any[] = [];
	user: any;
	searchPlayer: any;
	players: any[] = [];
	selectedPlayer: any[] = [];
	PROFILE_IMAGE_PATH: string;
	matchjoin: boolean = true;
	matchleave: boolean = false;

	constructor(private route: ActivatedRoute, private coreService: CoreService) {

		this.PROFILE_IMAGE_PATH = environment.PROFILE_IMAGE_PATH;
		this.user = JSON.parse(window.localStorage['teem_user']);

		this.sub = this.route.snapshot.params.matchId;
		if (this.sub) {
			this.coreService.getMatch(this.sub)
				.subscribe((response) => {
					this.match = response[0];
					console.log(this.match);
					this.match["filteredDate"] = moment(response[0].matchtime).format('MMM DD, YYYY');
					this.initMap();
					this.initTeam();
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
				});
		}
	}
	initGetMatch(id) {
		this.coreService.getMatch(id)
			.subscribe((response) => {
				this.match = [];
				this.team1 = [];
				this.team2 = [];
				this.team1player = [];
				this.team2player = [];

				this.match = response[0];
				this.match["filteredDate"] = moment(response[0].matchtime).format('MMM DD, YYYY');
				this.initTeam();
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}
	initMap() {
		let self = this;
		var markers = [];
		if (self.match.coordinates[0] != null && self.match.coordinates[1]) {
			var myLatLng = {
				lat: parseFloat(self.match.coordinates[1]),
				lng: parseFloat(self.match.coordinates[0])
			};
		} else {
			console.log("latitude not found");
			var myLatLng = { lat: 22.278323, lng: 70.798889 };
		}

		var map = new google.maps.Map(document.getElementById('nearByMap'), {
			zoom: 13,
			center: myLatLng
		});

		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			title: self.match.sport.title
		});
	}

	initTeam() {
		var sportplayer = this.match.subsportid['value'];
		if (this.match.team) {
			this.team1 = this.match.team['teamid1'];
			this.team2 = this.match.team['teamid2'];

			for (var i = 0; i < sportplayer; i++) {

				if (this.team1[i]) {
					var profileImg;

					if (this.team1[i].userid['id'] == this.user.id) {
						this.matchjoin = false;
						this.matchleave = true;
					}

					if (this.team1[i].userid['profileimage'] != "")
						profileImg = environment.PROFILE_IMAGE_PATH + this.team1[i].userid['profileimage'];
					else
						profileImg = "../../assets/img/sidebar_photo.png";

					this.team1player.push({ id: this.team1[i].userid['id'], profileimg: profileImg });
				} else {
					this.team1player.push({
						id: "",
						profileimg: "../../assets/img/avatar.png",
						userid: this.user['id'],
						matchid: this.match.id,
						teamid: 1
					});
				}

				if (this.team2[i]) {
					var profileImg;
					console.log('team2', this.team2[i]);
					if (this.team2[i].userid['id'] == this.user.id) {
						this.matchjoin = false;
						this.matchleave = true;
					}

					if (this.team2[i].userid['profileimage'] != "")
						profileImg = environment.PROFILE_IMAGE_PATH + this.team2[i].userid['profileimage'];
					else
						profileImg = "../../assets/img/sidebar_photo.png";

					this.team2player.push({ id: this.team2[i].userid['id'], profileimg: profileImg });
				} else {
					this.team2player.push({
						id: "",
						profileimg: "../../assets/img/avatar.png",
						userid: this.user['id'],
						matchid: this.match.id,
						teamid: 2
					});
				}
			}
		} else {
			for (var i = 0; i < sportplayer; i++) {
			this.team1player.push({
				id: "",
				profileimg: "../../assets/img/avatar.png",
				userid: this.user['id'],
				matchid: this.match.id,
				teamid: 1
			});

			this.team2player.push({
				id: "",
				profileimg: "../../assets/img/avatar.png",
				userid: this.user['id'],
				matchid: this.match.id,
				teamid: 2
			});
			}
		}
	}

	ngOnInit() {
	}

	loadAutoComplete() {
		// console.log("lenght = ", this.selectedSportsCenterName)
		if (this.searchPlayer.length >= 2) {
			this.coreService.getInvitationSearchPlayer(this.searchPlayer)
				.subscribe((response) => {
					console.log('auto loadAutoComplete response', response);
					this.players = response;
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
				});
		}
	}

	displayFn(player): string {
		return player ? player.firstname : "";
	}

	itemSelected() {
		console.log("itemselected");
		// for (let p of this.players) {
		// 	if (p.id == this.searchPlayer.id) {

		// 		this.selectedPlayer.push(p);
		// 		this.searchPlayer = "";
		// 		break;
		// 	}
		// }
		let insertInSelectedPlayer = true;
		for (let p of this.selectedPlayer) {
			if (p.id == this.searchPlayer.id) {
				insertInSelectedPlayer = false;
				break;
			}
		}
		if (insertInSelectedPlayer) {
			this.selectedPlayer.push(this.searchPlayer);
		}
		this.searchPlayer = "";
		console.log("search player", this.searchPlayer)
		console.log("selected players = ", this.selectedPlayer);
	}

	removeInvites(index) {
		this.selectedPlayer.splice(index, 1);
	}

	sendInvitations() {
		let userIds = [];
		for (let p of this.selectedPlayer) {
			userIds.push(p.id);
		}
		let user = JSON.parse(window.localStorage['teem_user']);
		let data = {
			userid: userIds.toString(),
			matchid: this.sub,
			inviterid: user.id
		};
		console.log("data to send", JSON.stringify(data));
		this.coreService.sendInvitations(JSON.stringify(data))
			.subscribe((response) => {
				console.log('response', response);
				this.coreService.emitSuccessMessage(response);
				this.selectedPlayer = [];
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	joinMatch(user: any) {
		delete user.id;
		delete user.profileimg;
		console.log("user", user);
		this.coreService.joinMatch(JSON.stringify(user)).subscribe(
			(result: any) => {
				this.coreService.emitSuccessMessage(result);
				this.initGetMatch(this.sub);
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			}
		);
	}
	leaveMatch() {
		this.coreService.leaveMatch(this.sub, this.user.id).subscribe(
			(result: any) => {
				this.coreService.emitSuccessMessage(result);
				this.initGetMatch(this.sub);
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			}
		);
	}

}
