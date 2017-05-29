import { environment } from './../../environments/environment';
import { CoreService } from '../core/core.service';

import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

@Component({
	selector: 'te-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit, AfterViewInit {
	userid = JSON.parse(window.localStorage['teem_user']).id;
	searchValue: any;
	users: any[];
	sportCentres: any[];
	followers: any[];
	scfollowers: any[];
	profileImageBaseUrl: string;


	constructor(private route: ActivatedRoute, private coreService: CoreService, private router: Router) {

		this.profileImageBaseUrl = environment.PROFILE_IMAGE_PATH;
	}

	ngOnInit() {
	}

	loadSearch() {
		if (this.searchValue) {
			this.coreService.loadSearch(this.searchValue, this.userid)
				.subscribe((response) => {
					this.users = response.data.user;
					console.log('response', response);
					this.followers = response.data.followusers;
					this.scfollowers = response.data.followsc;
					console.log('scfollowers', this.scfollowers);
					this.sportCentres = response.data.sportcenter;
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
				});
		}
	}

	ngAfterViewInit() {
		this.route.params.subscribe(params => {
			this.searchValue = params['searchValue'];
			this.loadSearch();
		});
	}

	navigateToUserProfile(user) {
		// console.log(user.id);
		this.router.navigate(['profileview', user.id]);
	}

	navigationToSc(sc) {
		this.router.navigate(['sportcenterview', sc.id]);
	}

	followUser(fuserid: any) {
		this.coreService.followUser(this.userid, fuserid)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				this.followers.push(fuserid);
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	unFollow(fuserid: any) {
		this.coreService.unFollowUser(this.userid, fuserid)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				var index = this.followers.indexOf(fuserid);
				if (index > -1) {
					this.followers.splice(index, 1);
				}
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	followSc(scid: any) {
		this.coreService.followSportcenter(this.userid, scid)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				this.scfollowers.push(scid);
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	unFollowSc(scid: any) {
		this.coreService.unFollowSc(this.userid, scid)
			.subscribe((response) => {
				this.coreService.emitSuccessMessage(response.message);
				var index = this.scfollowers.indexOf(scid);
				if (index > -1) {
					this.scfollowers.splice(index, 1);
				}
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}


}
