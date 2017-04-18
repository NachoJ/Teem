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
	benchPlayerOption = [];

	// filteredOptions: Observable<any[]>;

	/* style variables */
	// displayPitch: string = 'block';
	// displayFormDetails: string = 'none';

	constructor(private coreService: CoreService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private formBuilder: FormBuilder, private router: Router) {
    
    iconRegistry.addSvgIcon(
			'all',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/all-sports_off.svg'));
		iconRegistry.addSvgIcon(
			'soccer',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/futbol_off.svg'));
		iconRegistry.addSvgIcon(
			'basketball',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/baloncesto_off.svg'));
		iconRegistry.addSvgIcon(
			'paddle',
			sanitizer.bypassSecurityTrustResourceUrl('assets/svg/padel_off.svg'));
    
    

		this.matchFormGroup = this.formBuilder.group({
			sportCentreCtrl: ['', [Validators.required]],
			pitchRadioGroupCtrl: ['', [Validators.required]],
			benchCtrl: ['', [Validators.required]],
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
		for (let i = 0; i <= 59; i++) {
			this.minuteOptions.push({ value: i, viewValue: i });
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
		console.log("sports center set", sp);
		console.log("selectedSportsCenter from display", this.selectedSportsCenterId);
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
			this.selectedSportsCenterId = this.selectedSportsCenter.id;
			this.selectedSportsCenterName = this.selectedSportsCenter.name;
			console.log("selectedSportsCenterId", this.selectedSportsCenterId);

			this.coreService.loadPitches(this.selectedSportsCenterId)
				.subscribe((response) => {
					console.log(response);
					// this.error = '';
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
		this.coreService.getBenchPlayers(pitchSport)
			.subscribe((response) => {
				this.benchPlayerOption.length = 0;
				for (let key in response[0]) {
					this.benchPlayerOption.push({ value: key, viewValue: response[0][key] });
					// console.log("some = "+key,response[0][key])
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
		// console.log("selected sc option phone",this.selectedSportsCenterPhone);
		// this.isPitchSelected = true;
		// this.displayPitch = 'none';
		// this.displayFormDetails = 'block';

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
		console.log("date", filteredDate);
		let data = {
			"userid": userId,
			"scid": this.selectedSportsCenterId,
			"fieldid": this.selectedPitchId,
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
				// this.error = '';
				// this.success = response;
				// console.log("match res msg", response.data.message);
				this.coreService.emitSuccessMessage(response.data.message);
				this.router.navigate(['/match-details/' + response.data.data.id]);
				this.matchFormGroup.reset();
				this.pitches = [];
				// this.displayFormDetails = 'none';
				// this.displayPitch = 'block';
			},
			(error: any) => {
				// this.success = '';
				// this.error = error;
				this.coreService.emitErrorMessage(error);
			});
	}

}
