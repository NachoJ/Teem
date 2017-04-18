import { UserProfileImageComponent } from './../user-profile-image/user-profile-image.component';
import { CoreService } from './../../core/core.service';
import { DatePickerDirective } from './../../shared/directive/datepicker.directive';
import { environment } from './../../../environments/environment';

import { Component, OnInit, NgZone, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

declare var moment, $: any;
declare var google: any;

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, AfterViewInit {

	profile: FormGroup;
	firstname: FormControl;
	lastname: FormControl;
	dob: FormControl;
	city: FormControl;
	description: FormControl;
	basketball: FormControl;
	soccer: FormControl;
	paddle: FormControl;
	all: FormControl;
	imgSrc;

	success: string;
	error: string;

	allVal: any = false;
	basketballVal: any = false;
	soccerVal: any = false;
	padelVal: any = false;



	user: any;
	sport: any;
	checked: any = false;

	selectedCity = "";

	@ViewChild(DatePickerDirective) dtpicker: DatePickerDirective;

	constructor(private coreService: CoreService, private fb: FormBuilder,
		private route: ActivatedRoute, private zone: NgZone, public dialog: MdDialog, private router: Router) {

		this.user = JSON.parse(window.localStorage['teem_user']);
		this.createForm();
		this.imgSrc = '/assets/img/sidebar_photo.png'
		this.coreService.profileImage$.subscribe(resultImg => {
			this.imgSrc = environment.PROFILE_IMAGE_PATH + resultImg;
		});
	}

	ngOnInit() {

		this.sport = this.user.sports;
		let sportkey = [];
		if (this.sport) {

			sportkey = this.sport.split(",");
		}
		// sportkey = this.sport.split(",");

		let self = this;
		sportkey.forEach(function (index) {
			if (index == "basketball")
				self.basketballVal = true;

			if (index == "soccer")
				self.soccerVal = true;

			if (index == "paddle")
				self.padelVal = true;
		});

		$(document).ready(function () {
			console.log("jQuery is ready");
			self.initAutoComplete();
		});

	}

	ngAfterViewInit() {
		if (JSON.parse(window.localStorage.teem_user).profileimage != '') {
			console.log('gone in after view init ------------');

			this.imgSrc = environment.PROFILE_IMAGE_PATH + JSON.parse(window.localStorage.teem_user).profileimage;
		}

		if (this.basketballVal == true && this.soccerVal == true && this.padelVal == true) {
			this.checked = true;
		} else {
			this.checked = false;
		}


		let startDate = new Date(this.user.dob);
		let startDateAdd = startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();
		this.dtpicker.changeDate(startDateAdd, 'fromDate');

		this.profile.patchValue({
			firstname: this.user.firstname,
			lastname: this.user.lastname,
			city: this.user.city,
			description: this.user.description
		});
	}

	createForm() {
		this.firstname = new FormControl('', Validators.required);
		this.lastname = new FormControl('', Validators.required);
		this.dob = new FormControl('');
		this.city = new FormControl('', Validators.required);
		this.description = new FormControl('');
		this.basketball = new FormControl('');
		this.soccer = new FormControl('');
		this.paddle = new FormControl('');
		this.all = new FormControl('');

		this.profile = this.fb.group(
			{
				"firstname": this.firstname,
				"lastname": this.lastname,
				"dob": this.dob,
				"city": this.city,
				"description": this.description,
				"basketball": this.basketball,
				"soccer": this.soccer,
				"paddle": this.paddle,
				"all": this.all
			}
		);
	}

	formSubmit() {
		let self = this;
		let formVal = this.profile.value;
		console.log("formVal", formVal);

		let user = JSON.parse(window.localStorage['teem_user']);
		let sport = [];

		if (formVal.basketball == true)
			sport.push('basketball');
		if (formVal.soccer == true)
			sport.push('soccer');
		if (formVal.paddle == true)
			sport.push('paddle');

		delete formVal.basketball;
		delete formVal.soccer;
		delete formVal.paddle;
		delete formVal.all;

		formVal.sports = sport.join(',');
		formVal.userid = user.id;

		this.coreService.profileUpdate(JSON.stringify(formVal))
			.subscribe((response) => {
				//this.error = '';
				//this.success = response.data.message;
				this.coreService.emitSuccessMessage(response.data.message);
				self.userDetailEmit(response.data.data);
				window.localStorage['teem_user'] = JSON.stringify(response.data.data);
				// this.router.navigate(['']);
			},
			(error: any) => {
				//this.success = '';
				//this.error = error;
				this.coreService.emitErrorMessage(error);

			});
	}

	sportAllSelect() {
		this.coreService.sportIconDisplay({ key: 'all', val: this.allVal });

		if (this.allVal == true) {
			this.basketballVal = true;
			this.soccerVal = true;
			this.padelVal = true;
		}
		else {
			this.basketballVal = false;
			this.soccerVal = false;
			this.padelVal = false;
		}
	}

	sportSelect(name: string) {
		if (this.basketballVal == true && this.soccerVal == true && this.padelVal == true) {
			this.checked = true;
		} else {
			this.checked = false;
		}

		if (name == "basketball")
			this.coreService.sportIconDisplay({ key: name, val: this.basketballVal });

		if (name == "soccer")
			this.coreService.sportIconDisplay({ key: name, val: this.soccerVal });

		if (name == "paddle")
			this.coreService.sportIconDisplay({ key: name, val: this.padelVal });

	}
	// fileChange(event) {
	// 	/*var files = event.srcElement.files;
	// 	this.coreService.makeFileRequest(environment.BASEAPI + environment.PROFILE_IMAGE_UPDATE, [], files).subscribe(() => {
	// 		console.log('sent');
	// 	});*/
	// 	let fileList: FileList = event.target.files;
	// 	console.log('fileList', fileList);

	// 			this.coreService.profileImageUpload(fileList)
	// 			.subscribe((result) => {
	// 				console.log('result', result);
	// 			},
	// 			(error) => {
	// 				console.log('err', error);
	// 			}
	// 			)


	// 	// if (fileList.length > 0) {

	// 	// 	let file: File = fileList[0];
	// 	// 	console.log('formData', file);
	// 	// 	let formData: FormData = new FormData();

	// 	// 	formData.append('userid', this.user.id);
	// 	// 	formData.append('image', file);
	// 	// 	console.log('formData', formData); 
	// 	// 	this.coreService.profileImageUpload(formData)
	// 	// 		.subscribe((result) => {
	// 	// 			console.log('result', result);
	// 	// 		},
	// 	// 		(error) => {
	// 	// 			console.log('err', error);
	// 	// 		}
	// 	// 		)
	// 	// }
	// }
	profileDialog() {
		let dialogRef = this.dialog.open(UserProfileImageComponent, {
			width: '70%',
			height: '75%'
		});

		//$("#avatar-modal").modal("show");
	}

	userDetailEmit(user: any) {
		this.coreService.userDetailEmit(user);
	}

	initAutoComplete() {
		var self = this;
		var input = document.getElementById('city');
		var options = {
			types: ['(cities)'],
		};

		var autocomplete = new google.maps.places.Autocomplete(input, options);
		google.maps.event.addDomListener(input, 'keydown', function (e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				self.assignValuetoCity(e.target.value);
				console.log("prevented default");
			}
		});
	}

	assignValuetoCity(v) {
		console.log("city = ", v);
		this.selectedCity = v;
	}
}