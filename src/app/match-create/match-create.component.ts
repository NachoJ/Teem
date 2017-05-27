import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DomSanitizer } from '@angular/platform-browser';
import { MdIconRegistry } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";

import { CoreService } from '../core/core.service';
import { Pitch } from '../shared/interface/pitch';
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

declare var moment: any;
declare var $: any;

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

	date: string = "";
	dt: string = '';
	hour: string = '20';
	hourOptions = [];

	minute: string = '0';
	minuteOptions = [];

	payment: string = 'atthepitch';

	currency: string = "eur";
	currencyOption = [];

	cost: string;

	bench: any;
	benchOpt = [];

	subSport: string;
	subSportOption = [];

	selectedPitchSport: any;

	someradio: any;

	subscId: any;
	subscName: any;
	subscAddress: any;

	currencySymbol = String.fromCharCode(36);
	EURSymbol = String.fromCharCode(8364);
	USDSymbol = String.fromCharCode(36);
	GBPSymbol = String.fromCharCode(163);
	SEKSymbol = String.fromCharCode(107) + String.fromCharCode(114);
	AUDSymbol = String.fromCharCode(36);

	hideCurrencyCtrls = false;
	hideBenchPlayerCtrl: boolean = false;

	translate: any;
	// filteredOptions: Observable<any[]>;

	/* style variables */
	// displayPitch: string = 'block';
	// displayFormDetails: string = 'none';

	// tslint:disable-next-line:max-line-length
	constructor(private coreService: CoreService, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, translate: TranslateService) {

		this.translate = translate;

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
				this.currencyChanged();
				// console.log("currecy", response)
			},
			(error: any) => {
				this.error = error;
			});

		for (let i = 0; i <= 23; i++) {
			this.hourOptions.push({ value: i + "", viewValue: (i > 9 ? i : "0" + i) });
		}
		for (let i = 0; i <= 59; i += 15) {
			this.minuteOptions.push({ value: i + "", viewValue: (i > 9 ? i : "0" + i) });
		}

		for (let j = 0; j <= 10; j++) {
			this.benchOpt.push({ value: j, viewValue: j });
		}

		this.date = moment().add(1, 'days').format('YYYY-MM-DD');
		// date.setDate(date.getDate() + 1)

		this.subscId = this.route.snapshot.params.scId;
		this.subscName = this.route.snapshot.params.scName;
		this.subscAddress = this.route.snapshot.params.scAddress;
		if (this.subscId && this.subscName && this.subscAddress) {
			this.selectedSportsCenter = <any>{};
			this.selectedSportsCenter.id = this.subscId;
			this.selectedSportsCenter.name = this.subscName;
			this.selectedSportsCenter.address = this.subscAddress;
			this.loadAutoComplete();
			this.itemSelected();
			this.displayFn(this.selectedSportsCenter);
		}

		this.moneyMethodSelected();
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
					if (this.pitches.length == 1) {
						this.someradio = this.pitches[0].id;
						this.pitchSelected(this.pitches[0].id, this.pitches[0].sport);
					} else {
						this.subSportOption.length = 0;
					}
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
		this.coreService.getSubSports(JSON.stringify(data))
			.subscribe((response) => {
				this.subSportOption.length = 0;
				let tempsport = "";
				for (var res of response) {
					if (tempsport != res.title) {
						tempsport = res.title;
						this.subSportOption.push({ value: res.id, viewValue: res.title, isDisabled: true });
					}
					for (var r of res.subsport) {
						this.subSportOption.push({ value: r.id, viewValue: res.title, viewValue2: r.title, sportid: res.id, isDisabled: false });
					}
				}
				// selecting sub sport if subsport is only one
				if (this.subSportOption.length == 2) {
					this.subSport = this.subSportOption[1].value;
					this.bench = 0;
					this.subSportChanged(this.subSportOption[1]);
				} else {
					this.subSport = "";
					this.bench = "";
				}
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
			});
		this.selectedPitchId = pitchid;

		// assigning phone number
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
		// let filteredDate = moment(this.date).format('YYYY/MM/DD');
		let finalDate = filteredDate + ' ' + this.hour + ":" + this.minute;
		finalDate = moment(new Date(finalDate)).format('YYYY-MM-DDTHH:mm:ss.Z');
		console.log("offset = ", finalDate);
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
		if (!data.benchplayers)
			data.benchplayers = 0;

		console.log("data = ", JSON.stringify(data));

		this.coreService.createMatch(JSON.stringify(data))
			.subscribe((response) => {
				console.log(response);
				this.coreService.emitSuccessMessage(response.message);
				this.router.navigate(['/match-details/' + response.data.id]);
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
			this.hideCurrencyCtrls = false;
			// this.currency = "";
			// this.cost = "";
		} else {
			this.hideCurrencyCtrls = true;
			this.matchFormGroup.get("currencyCtrl").enable();
			this.matchFormGroup.get("costCtrl").enable();
		}
	}

	currencyChanged() {
		// console.log("curreny changed = ", this.currency);
		switch (this.currency) {
			case "eur":
				this.currencySymbol = this.EURSymbol;
				break;
			case "usd":
				this.currencySymbol = this.USDSymbol;
				break;
			case "gbp":
				this.currencySymbol = this.GBPSymbol;
				break;
			case "sek":
				this.currencySymbol = this.SEKSymbol;
				break;
			case "aud":
				this.currencySymbol = this.AUDSymbol;
				break;
			default:
				this.currencySymbol = this.AUDSymbol;
		}
	}

	subSportChanged(e: any) {
		let padelsport = false;
		for (let sp of this.subSportOption) {
			if (sp.value == e.value) {
				if (sp.viewValue.toLowerCase().includes('padel')) {
					padelsport = true;
				}
				break;
			}
		}
		if (padelsport) {
			this.matchFormGroup.controls.benchCtrl.disable();
			this.hideBenchPlayerCtrl = true;
		} else {
			this.matchFormGroup.controls.benchCtrl.enable();
			this.hideBenchPlayerCtrl = false;
		}
		// let rSubSportViewValue = rSubSport.viewValue;
		// if (rSubSportViewValue.toLowerCase().includes('padel'))
		// 	this.matchFormGroup.controls.benchCtrl.disable();
	}
}
