import { Component, OnInit, NgZone, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Router } from '@angular/router';

import { CoreService } from '../core/core.service';

import { environment } from '../../environments/environment';

declare var moment: any;
declare var google: any;
declare var $: any;
declare let window;

@Component({
	selector: 'app-find-match',
	templateUrl: './find-match.component.html',
	styleUrls: ['./find-match.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FindMatchComponent implements OnInit {

	error: string;
	success: string;
	cityName: string = "";

	sport: string = "all";

	latitudeMap: any;
	longitudeMap: string;

	nearByMatch: any[] = [];

	nearByMatchMarkers: any[] = [];

	PROFILE_IMAGE_PATH: string;

	constructor(private coreService: CoreService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private ngZone: NgZone, private router: Router) {
		this.PROFILE_IMAGE_PATH = environment.PROFILE_IMAGE_PATH;

		iconRegistry.addSvgIcon(
			'all',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/all-sports_off.svg'));
		iconRegistry.addSvgIcon(
			'football',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/futbol_off.svg'));
		iconRegistry.addSvgIcon(
			'basketball',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baloncesto_off.svg'));
		iconRegistry.addSvgIcon(
			'padel',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/padel_off.svg'));

		window["FindMatchComponent"] = this;


	}

	ngOnInit() {
		let self = this;
		// document.addEventListener("DOMContentLoaded", function (event) {
		// 	console.log("DOMContentLoaded");
		// 	self.initMap();
		// });
		$(document).ready(function () {
			console.log("jQuery is ready");
			self.initMap();
		});
	}

	initMap() {
		let self = this;
		var markers = [];
		if (self.latitudeMap != null && self.longitudeMap) {
			var myLatLng = {
				lat: parseFloat(self.latitudeMap),
				lng: parseFloat(self.longitudeMap)
			};
		} else {
			console.log("latitude not found");
			var myLatLng = { lat: 22.278323, lng: 70.798889 };
		}

		var map = new google.maps.Map(document.getElementById('nearByMap'), {
			zoom: 13,
			center: myLatLng
		});

		// Create the search box and link it to the UI element.
		var input = document.getElementById('pac-input');
		google.maps.event.addDomListener(input, 'keydown', function (e) {
			if (e.keyCode == 13) {
				self.assignValuetoInput(e.target.value);
			}
		});
		var searchBox = new google.maps.places.SearchBox(input);
		// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		// map.addListener('bounds_changed', function () {
		// 	searchBox.setBounds(map.getBounds());
		// });

		var index = 0;
		for (let myMarker of self.nearByMatchMarkers) {
			// console.log("setting marker",myMarker.myLatLng)
			var image = '';
			if (myMarker.title == 'soccer') {

				image = 'assets/map-pins/rsz_soccer-pin.png';
			}
			else if (myMarker.title == 'basketball') {

				image = 'assets/map-pins/rsz_basketball-pin.png';
			}
			else {

				image = 'assets/map-pins/rsz_padel-pin.png';
			}
			var showContent = '<h4> Creator: ' + myMarker.creator + '<h4> Game: ' + myMarker.title + '</h4><p>Price: ' + myMarker.price +
				"</p><br><button md-button onclick=FindMatchComponent.navigateToDetails('" + myMarker.id + "');>Join Now</button>";
			// console.log("my marker id", myMarker.id);
			// console.log("content = ", showContent);

			var infowindow = new google.maps.InfoWindow({
				content: showContent,
				maxWidth: 200
			});

			markers[index] = new google.maps.Marker({
				icon: image,
				position: myMarker.myLatLng,
				map: map,
				title: myMarker.title
			});
			markers[index].addListener('click', function () {
				infowindow.setPosition(myMarker.myLatLng);
				infowindow.open(map, markers[index]);
			});
			index++;
		}
	}

	navigateToDetails(id) {
		console.log('redirect', id);
		this.router.navigate(['/match-details/' + id]);
	}

	getAndSetLocation() {
		let self = this;
		if (navigator.geolocation) {
			console.log("navigator.geolocation found");

			navigator.geolocation.getCurrentPosition(this.setLocation.bind(this));
		} else {
			this.error = "Cannot find Geolocation";
		}
	}
	setLocation(position) {
		// console.log("position",position);
		// console.log("latitudeMap",position.coords.latitude);
		// console.log("temp ",temp);

		this.latitudeMap = position.coords.latitude;
		this.longitudeMap = position.coords.longitude;
		this.getMatchMarkers();
	}

	getLatLongByCityName() {
		console.log("cityName", this.cityName);
		this.coreService.getLatLongByCityName(this.cityName)
			.subscribe((response) => {
				console.log(response)
				this.latitudeMap = response.lat;
				this.longitudeMap = response.lng;
				// this.initMap();
				this.getMatchMarkers();
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// console.log(error);
				// this.success = '';
				// this.error = error;
				// this._router.navigate(['/login']);
			});

	}

	getMatchMarkers() {
		let data = {
			"lat": this.latitudeMap,
			"long": this.longitudeMap,
			"maxdistance": "2000",
			"sport": this.sport
		};
		this.coreService.getNearByMatch(data)
			.subscribe((response) => {
				console.log("nearByMatch = ", response);
				this.nearByMatch = [];
				// this.nearByMatch = response;
				for (let match of response) {
					match["filteredMatchTime"] = moment(match.matchtime).format('HH:mm');
					match["filteredMatchDate"] = moment(match.matchtime).format('MMM DD, YYYY');
					this.nearByMatch.push(match);
				}
				this.nearByMatch.sort(function (a, b) {
					if (a.filteredMatchDate < b.filteredMatchDate) {
						return -1;
					}
					if (a.filteredMatchDate > b.filteredMatchDate) {

						return 1;
					}
					return 0;
				});
				let dateToCheck: string = "";
				for (let match of this.nearByMatch) {
					if (match.filteredMatchDate != dateToCheck) {
						match["displayDate"] = true;
						dateToCheck = match.filteredMatchDate;
					} else {
						match["displayDate"] = false;
					}

				}
				// console.log("moment = ", moment(match.matchtime).format('HH:mm'));
				// console.log("Matches", this.nearByMatch)
				this.setMatchMarker();
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// console.log(error);
				// this.success = '';
				// this.error = error;
				// this._router.navigate(['/login']);
			});
	}

	setMatchMarker() {
		this.nearByMatchMarkers.length = 0;
		for (let match of this.nearByMatch) {
			var marker = {
				id: match._id,
				creator: match.userdetail[0].username,
				title: match.sport,
				price: match.price,
				myLatLng: {
					lat: parseFloat(match.coordinates[1]),
					lng: parseFloat(match.coordinates[0])
				}
			}
			this.nearByMatchMarkers.push(marker);

		}
		// console.log("MArkers", this.nearByMatchMarkers);
		this.initMap();
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

	assignValuetoInput(v) {
		console.log("value assigned");
		this.cityName = v;
	}

}
