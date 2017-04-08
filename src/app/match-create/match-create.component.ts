import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { CoreService } from '../core/core.service';
import { Pitch } from '../shared/interface/pitch';

@Component({
	selector: 'app-match-create',
	templateUrl: './match-create.component.html',
	styleUrls: ['./match-create.component.scss']
})
export class MatchCreateComponent implements OnInit {

	matchFormGroup: FormGroup;

	success: string;
	error: string;

	selectedSportsCenterName: string = '';
	selectedSportsCenterId: string = '';
	selectedSportsCenterPhone: string;
	sportsCenterOptions = [];
	pitches: Pitch[];
	selectedPitchId: string;

	sport: string;
	sportOptions = [];

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

	// filteredOptions: Observable<any[]>;

	/* style variables */
	displayPitch: string = 'block';
	displayFormDetails: string = 'none';

	constructor(private coreService: CoreService, private formBuilder: FormBuilder) {

		this.matchFormGroup = this.formBuilder.group({
			sportCentreCtrl: ['', [Validators.required]],
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

		this.coreService.getAllSports()
			.subscribe((response) => {
				this.sportOptions = response;
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
		console.log("lenght = ", this.selectedSportsCenterName)
		if (this.selectedSportsCenterName.length >= 1)
			this.coreService.loadSportCentreAutoComplete(this.selectedSportsCenterName)
				.subscribe((response) => {
					// console.log('auto loadAutoComplete response', response);
					this.sportsCenterOptions = response;
				},
				(error: any) => {
					this.error = error;
				});
	}

	itemSelected() {
		console.log("selectedSportsCenterName", this.selectedSportsCenterName);

		if (this.selectedSportsCenterName.length >= 1) {
			for (let sc of this.sportsCenterOptions) {
				if (sc.id == this.selectedSportsCenterName) {
					this.selectedSportsCenterId = sc.id;
					this.selectedSportsCenterName = sc.name;
					console.log("if", sc.name)
				}
			}
			console.log("selectedSportsCenterId", this.selectedSportsCenterId);

			this.coreService.loadPitches(this.selectedSportsCenterId)
				.subscribe((response) => {
					console.log(response);
					this.error = '';
					this.pitches = response;
				},
				(error: any) => {
					this.success = '';
					this.error = error;
				});
		}
	}

	pitchSelected(pitchid) {
		console.log(pitchid);
		console.log("selected sc", this.selectedSportsCenterId);
		this.selectedPitchId = pitchid;
		for (let sc of this.sportsCenterOptions) {
			if (sc.id == this.selectedSportsCenterId)
				this.selectedSportsCenterPhone = sc.phone;
		}
		// console.log("selected sc option phone",this.selectedSportsCenterPhone);
		// this.isPitchSelected = true;
		this.displayPitch = 'none';
		this.displayFormDetails = 'block';

	}

	changeSportCentre() {
		this.displayFormDetails = 'none';
		this.displayPitch = 'block';
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
				this.error = '';
				this.success = response;
				this.matchFormGroup.reset();
				this.pitches = [];
				this.displayFormDetails = 'none';
				this.displayPitch = 'block';
			},
			(error: any) => {
				this.success = '';
				this.error = error;
			});
	}

}
