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

	searchPlayer: any;
	players: any[] = [];
	selectedPlayer: any[] = [];
	PROFILE_IMAGE_PATH: string;

	constructor(private route: ActivatedRoute, private coreService: CoreService) {

		this.PROFILE_IMAGE_PATH = environment.PROFILE_IMAGE_PATH;

		this.sub = this.route.snapshot.params.matchId;
		if (this.sub) {
			this.coreService.getMatch(this.sub)
				.subscribe((response) => {
					console.log(response);
					this.match = response[0];
					this.match["filteredDate"] = moment(response[0].matchtime).format('MMM DD, YYYY');
					this.initMap();
					this.initTeam();
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);

				});
		}
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
			title: self.match.sport
		});
	}
	initTeam() {
		// this.coreService.
	}

	ngOnInit() {
	}

	loadAutoComplete() {
		// console.log("lenght = ", this.selectedSportsCenterName)
		if (this.searchPlayer.length >= 1) {
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
		for (let p of this.players) {
			if (p.id == this.searchPlayer.id) {
				this.selectedPlayer.push(p);
				this.searchPlayer = "";
				break;
			}
		}
		this.searchPlayer = "";
		console.log("search player", this.searchPlayer)
		console.log("selected players = ", this.selectedPlayer);
	}

	removeInvites(index) {
		this.selectedPlayer.splice(index,1);
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

}
