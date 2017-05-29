import { environment } from './../../../environments/environment';
import { CoreService } from './../../core/core.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'te-following',
	templateUrl: './following.component.html',
	styleUrls: ['./following.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FollowingComponent implements OnInit {

	userId: any;
	following = <any>{};
	isMobile = false;
	profileImageBaseUrl: string;


	constructor(private coreService: CoreService) {
		this.userId = JSON.parse(window.localStorage['teem_user']).id;
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;
		this.coreService.getFollowing(this.userId)
			.subscribe((result: any) => {
				this.following = result.data;
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
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

}
