import { Component, OnInit, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';

import { CoreService } from '../core/core.service';

declare var google: any;
declare let window;

@Component({
	selector: 'app-find-match',
	templateUrl: './find-match.component.html',
	styleUrls: ['./find-match.component.scss']
})
export class FindMatchComponent implements OnInit {

	error: string;
	success: string;
	cityName: string;

	sport: string = "all";

	latitudeMap: any;
	longitudeMap: string;

	nearByMatch: any[] = [];

	nearByMatchMarkers: any[] = [];

	constructor(private coreService: CoreService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer,private ngZone: NgZone) {
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
		
		window["FindMatchComponent"]=this;
	}

	ngOnInit() {
		this.initMap();
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
		var index = 0;
		for (let myMarker of self.nearByMatchMarkers) {
			// console.log("setting marker",myMarker.myLatLng)
			var image = '';
			if (myMarker.title == 'soccer')
				image = 'assets/map-pins/rsz_soccer-pin.png';
			else if (myMarker.title == 'basketball')
				image = 'assets/map-pins/rsz_basketball-pin.png';
			else
				image = 'assets/map-pins/rsz_padel-pin.png';

			var infowindow = new google.maps.InfoWindow({
				content: '<h4> Game: ' + myMarker.title + '</h4><p>Price: ' + myMarker.price + '</p><br><button md-button onclick="FindMatchComponent.someFun()">Join Now</button>',
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

	someFun() {
		console.log('redirect');
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
		this.coreService.getLatLongByCityName(this.cityName)
			.subscribe((response) => {
				console.log(response)
				this.latitudeMap = response.lat;
				this.longitudeMap = response.lng;
				// this.initMap();
				this.getMatchMarkers();
			},
			(error: any) => {
				console.log(error);
				this.success = '';
				this.error = error;
				// this._router.navigate(['/login']);
			});

	}

	getMatchMarkers() {
		let data = {
			"lat": this.latitudeMap,
			"long": this.longitudeMap,
			"maxdistance": "200",
			"sport": this.sport
		};
		this.coreService.getNearByMatch(data)
			.subscribe((response) => {
				// console.log(response)
				this.nearByMatch = response;
				console.log("Matches", this.nearByMatch)
				this.setMatchMarker();
			},
			(error: any) => {
				console.log(error);
				this.success = '';
				this.error = error;
				// this._router.navigate(['/login']);
			});
	}

	setMatchMarker() {
		for (let match of this.nearByMatch) {
			var marker = {
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

}
