import { environment } from './../../environments/environment';
import { CoreService } from '../core/core.service';
import { ActivatedRoute } from '@angular/router';
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
	profileUserId: any;
	profileImageBaseUrl: string;
	follow = true;
	isPadel = false;
	isSoccer = false;
	isBasketball = false;

	showFollowbtn = true;

	userId: any;

	isMobile = false;

	constructor(private route: ActivatedRoute, private coreService: CoreService) {

		this.userId = JSON.parse(window.localStorage['teem_user']).id;
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;

		this.profileUserId = this.route.snapshot.params.userId;
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
		console.log("unfollow clicked");
		this.coreService.unFollowUser(this.userId, this.profileUserId)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				this.follow = true;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

}
