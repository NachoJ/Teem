import { CoreService } from 'app/core/core.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'te-followers',
	templateUrl: './followers.component.html',
	styleUrls: ['./followers.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FollowersComponent implements OnInit {

	userId: any;
	followers = <any>{};
	isMobile = false;
	profileImageBaseUrl: string;

	constructor(private coreService: CoreService) {
		this.userId = JSON.parse(window.localStorage['teem_user']).id;
		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;
		this.coreService.getFollowers(this.userId)
			.subscribe((result: any) => {
				this.followers = result.data;
				for(let f of this.followers){
					console.log("object",f);
				}
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
