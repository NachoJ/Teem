import { environment } from './../../environments/environment';
import { CoreService } from '../core/core.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
declare var $, google;

@Component({
	selector: 'te-sportcenter-view',
	templateUrl: './sportcenter-view.component.html',
	styleUrls: ['./sportcenter-view.component.scss']
})

export class SportcenterViewComponent implements OnInit {

	scid: any;
	sportcenter = <any>{};
	followers=<any>{};
	pitch=<any>{};

	userId: any;
	follow: boolean = false;
	profileImageBaseUrl: string;
	isMobile = false;

	constructor(private route: ActivatedRoute, public corservice: CoreService,iconRegistry: MdIconRegistry,sanitizer: DomSanitizer) {
		iconRegistry.addSvgIcon(
			'Soccer',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/futbol_off.svg'));
		iconRegistry.addSvgIcon(
			'Basketball',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baloncesto_off.svg'));
		iconRegistry.addSvgIcon(
			'Padel',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/padel_off.svg'));


		this.userId = JSON.parse(window.localStorage['teem_user']).id;
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;
		
		this.scid = this.route.snapshot.params.scId;
		this.sportcenterDetail();
	}

	ngOnInit() {
		let self = this;
		$(document).ready(function () {
			self.initAutocomplete();
		});

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

	initAutocomplete() {
		var initlat = 40.415363;
		var initlng = -3.707398;
		var lat = this.sportcenter['lat'];
		var long = this.sportcenter['long'];
		// console.log("lat",lat);
		// console.log("long",long);
		// setting marker coordinate to display on map when record update
		if (lat != "" && long != "") {
			initlat = parseFloat(lat);
			initlng = parseFloat(long);
		}
		// setting map from here for update record manually
		var map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: initlat, lng: initlng },
			zoom: 16,
			mapTypeId: 'roadmap'
		});
		var myMarker = new google.maps.Marker({
			position: { lat: initlat, lng: initlng },
			draggable: false,
			animation: google.maps.Animation.DROP,
			map: map
		});
	}

	sportcenterDetail() {
		this.corservice.sportcenterView(this.scid).subscribe(
			(result: any) => {
				console.log("result", result);
				this.sportcenter = result.data[0];
			//	console.log("this.sportcenter.followers[0].userdetail",this.sportcenter.followers[0].userdetail);
				this.followers=this.sportcenter.followers;
				this.pitch=this.sportcenter.fielddetail;

				if (this.sportcenter.followers[0].userdetail.length!=0) {
					for (let follower of this.sportcenter.followers) {
						if (follower.userdetail[0]._id == this.userId) {
							this.follow = true;
							console.log("this.follow",this.follow);
							break;
						}
					}
				}
				this.initAutocomplete();
			},
			(error: any) => {

			}
		);
	}

	followSportcenter() {
		this.corservice.followSportcenter(this.userId, this.scid)
			.subscribe((response) => {
				this.corservice.emitSuccessMessage(response.message);
				this.follow = true;
			},
			(error: any) => {
				this.corservice.emitErrorMessage(error);
			});
	}

	unFollowSc() {
		this.corservice.unFollowSc(this.userId, this.scid)
			.subscribe((response) => {
				this.corservice.emitSuccessMessage(response.message);
				this.follow = false;
			},
			(error: any) => {
				this.corservice.emitErrorMessage(error);
			});
	}
}
