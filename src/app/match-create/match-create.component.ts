import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Router } from "@angular/router";

import { CoreService } from '../core/core.service';
import { Pitch } from '../shared/interface/pitch';

@Component({
	selector: 'app-match-create',
	templateUrl: './match-create.component.html',
	styleUrls: ['./match-create.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MatchCreateComponent implements OnInit {

	matchFormGroup: FormGroup;

	success: string;
	error: string;

	selectedSportsCenter: any;
	selectedSportsCenterName: string = '';
	selectedSportsCenterId: string = '';
	selectedSportsCenterPhone: string;
	selectedSportsCenterAddress = "";
	sportsCenterOptions = [];
	pitches: Pitch[];
	selectedPitchId: string;

	// sport: string;
	// sportOptions = [];

	date: string = '';
	hour: string;
	hourOptions = [];

	minute: string;
	minuteOptions = [];

	payment: string;

	currency: string;
	currencyOption = [];

	cost: string;

	bench: string;
	benchOpt = [];

	subSport: string;
	subSportOption = [];

	selectedPitchSport: any;

	someradio = "";

	isCost: boolean = false;

	// filteredOptions: Observable<any[]>;

	/* style variables */
	// displayPitch: string = 'block';
	// displayFormDetails: string = 'none';

	constructor(private coreService: CoreService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private formBuilder: FormBuilder, private router: Router) {

		iconRegistry.addSvgIcon(
			'all',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/all-sports_off.svg'));
		iconRegistry.addSvgIcon(
			'Soccer',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/futbol_off.svg'));
		iconRegistry.addSvgIcon(
			'Basketball',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baloncesto_off.svg'));
		iconRegistry.addSvgIcon(
			'Padel',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/padel_off.svg'));



		this.matchFormGroup = this.formBuilder.group({
			sportCentreCtrl: ['', [Validators.required]],
			pitchRadioGroupCtrl: ['', [Validators.required]],
			benchCtrl: ['', [Validators.required]],
			subSportCtrl: ['', [Validators.required]],
			dateCtrl: ['', [Validators.required]],
			hourCtrl: ['', [Validators.required]],
			minuteCtrl: ['', [Validators.required]],
			paymentCtrl: ['', [Validators.required]],
			currencyCtrl: ['', [Validators.required]],
			costCtrl: ['', [Validators.required]],
		});

		this.coreService.getAllCurrency()
			.subscribe((response) => {
				this.currencyOption = response;
				// console.log("currecy", response)
			},
			(error: any) => {
				this.error = error;
			});

		for (let i = 0; i <= 23; i++) {
			this.hourOptions.push({ value: i, viewValue: i });
		}
		for (let i = 0; i <= 59; i += 15) {
			this.minuteOptions.push({ value: i, viewValue: i });
		}

		for (let j = 0; j <= 10; j++) {
			this.benchOpt.push({ value: j, viewValue: j });
		}

	}

	ngOnInit() {
	}

	loadAutoComplete() {
		console.log("lenght = ", this.selectedSportsCenter);
		if (this.selectedSportsCenter.length >= 1) {
			this.coreService.loadSportCentreAutoComplete(this.selectedSportsCenter)
				.subscribe((response) => {
					// console.log('auto loadAutoComplete response', response);
					this.sportsCenterOptions = response;
				},
				(error: any) => {
					this.error = error;
				});
		}
	}

	displayFn(sp): string {
		// console.log("sports center set", sp);
		// console.log("selectedSportsCenter from display", this.selectedSportsCenterId);
		// console.log("selectedSportsCenterName", this.selectedSportsCenter);
		return sp ? sp.name : "";
	}

	itemSelected() {
		console.log("selectedSportsCenter form item select", this.selectedSportsCenter);

		if (this.selectedSportsCenter) {
			// for (let sc of this.sportsCenterOptions) {
			// 	if (sc.id == this.selectedSportsCenterName) {
			// 		this.selectedSportsCenterId = sc.id;
			// 		this.selectedSportsCenterName = sc.name;
			// 		console.log("if", sc.name)
			// 	}
			// }
			this.someradio = "";
			this.selectedSportsCenterId = this.selectedSportsCenter.id;
			this.selectedSportsCenterName = this.selectedSportsCenter.name;
			this.selectedSportsCenterAddress = this.selectedSportsCenter.address;
			console.log("selectedSportsCenterId", this.selectedSportsCenterId);

			this.coreService.loadPitches(this.selectedSportsCenterId)
				.subscribe((response) => {
					console.log("pitches = ", response);
					// this.error = '';
					// for (let res of response){
					// 	console.log("pitch image = ", res.sportdetail.sportid.title);
					// 	res.imageurl = res.sportdetail.sportid.title;
					// 	this.pitches = response;
					// }
					this.pitches = response;
				},
				(error: any) => {
					this.coreService.emitErrorMessage(error);
					// this.success = '';
					// this.error = error;
				});
		}
	}

	pitchSelected(pitchid, pitchSport) {
		let data = {
			sportid: pitchSport
		}
		console.log("selected pitchSport = ", JSON.stringify(data));
		this.coreService.getSubSports(JSON.stringify(data))
			.subscribe((response) => {
				this.subSportOption.length = 0;
				console.log("pitch sub sport response", response);
				// tslint:disable-next-line:forin
				let tempsport = "";
				for (var res of response) {
					// console.log("res = ",res);
					if (tempsport != res.title) {
						tempsport = res.title;
						console.log("sport = ", res.title + " " + res.id);
						this.subSportOption.push({ value: res.id, viewValue: res.title, isDisabled: true });
					}
					for (var r of res.subsport) {
						console.log("r id = " + r.title + " " + r.id)
						this.subSportOption.push({ value: r.id, viewValue: res.title + " " + r.title, sportid: res.id, isDisabled: false });
					}
					// console.log("res title " + res.title + " res value " + res.value);
					// this.subSportOption.push({ value: res.id, viewValue: res.sportid.title + " " + res.title, isDisabled: false });
				}
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// this.success = '';
				// this.error = error;
			});
		this.selectedPitchId = pitchid;
		for (let sc of this.sportsCenterOptions) {
			if (sc.id == this.selectedSportsCenterId)
				this.selectedSportsCenterPhone = sc.phone;
		}


	}

	changeSportCentre() {
		// this.displayFormDetails = 'none';
		// this.displayPitch = 'block';
	}

	createMatch() {
		console.log("create Match");
		let user = JSON.parse(localStorage.getItem('teem_user'));
		let userId = user.id;
		let filteredDate = this.date.replace(/-/gi, '/');
		let finalDate = filteredDate + ' ' + this.hour + ":" + this.minute;
		let sportid: any;
		for (let i of this.subSportOption) {
			if (i.value == this.subSport) {
				sportid = i.sportid;
				// console.log("sport id found= ", i);
			}
		}
		console.log("date", filteredDate);
		let data = {
			"userid": userId,
			"scid": this.selectedSportsCenterId,
			"fieldid": this.selectedPitchId,
			"sport": sportid,
			"subsportid": this.subSport,
			"benchplayers": this.bench,
			"matchtime": finalDate,
			"paymenttype": this.payment,
			"currency": this.currency,
			"price": this.cost
		};

		console.log("data = ", JSON.stringify(data));

		this.coreService.createMatch(JSON.stringify(data))
			.subscribe((response) => {
				console.log(response);
				this.coreService.emitSuccessMessage(response.data.message);
				this.router.navigate(['/match-details/' + response.data.data.id]);
				this.matchFormGroup.reset();
				this.pitches = [];
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
	}

	moneyMethodSelected() {
		console.log("money method = ", this.payment)
		if (this.payment == 'free') {
			this.matchFormGroup.get("currencyCtrl").disable();
			this.matchFormGroup.get("costCtrl").disable();
			this.currency = "";
			this.cost = "";
		} else {
			this.matchFormGroup.get("currencyCtrl").enable();
			this.matchFormGroup.get("costCtrl").enable();
		}
	}

}
