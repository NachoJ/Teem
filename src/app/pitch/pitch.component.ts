import { Component, OnInit, } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoreService } from '../core/core.service';
import { Pitch } from '../shared/interface/pitch';

@Component({
	selector: 'app-pitch',
	templateUrl: './pitch.component.html',
	styleUrls: ['./pitch.component.scss']
})
export class PitchComponent implements OnInit {

	error: string;
	success: string;

	name: string;
	covering: string;
	lights: string;
	surface: string;
	sport: string;
	surfaceOptions = [
		{ value: 'option1', viewValue: 'option1' },
		{ value: 'option2', viewValue: 'option2' },
		{ value: 'option3', viewValue: 'option3' }
	];
	sportOptions =[];
	// sportOptions = [
	// 	{ value: 'option1', viewValue: 'option1' },
	// 	{ value: 'option2', viewValue: 'option2' },
	// 	{ value: 'option3', viewValue: 'option3' }
	// ];
	price: string;

	pitches: Pitch[] = [];
	deleteData = [];

	// nameCtrl = FormControl[];

	sub: any;

	// public pitchFormGroup: FormGroup;
	public pitchFormGroupArray: FormGroup[] = [];
	isFormValid: boolean = false;

	constructor(private coreService: CoreService, private formBuilder: FormBuilder, private route: ActivatedRoute, ) {
		this.sub = this.route.snapshot.params.scId;
		console.log("sub", this.sub);
		// this.pitchFormGroup = this.formBuilder.group({
		// 	some: ['', [Validators.required]],
		// 	pt: this.formBuilder.array([])
		// });
		// const control = <FormArray>this.pitchFormGroup.controls['pt'];
		// const addrCtrl = this.formBuilder.group({
		//     name: ['', Validators.required],
		// });
		// control.push(addrCtrl);
		// console.log("some",this.pitchFormGroup.controls.pt['controls'][0]['controls']['name'])


		//  this.pitchFormGroup = this.formBuilder.group({
		// 	name: ['', [Validators.required]],
		// covering: ['', [Validators.required]],
		// lights: ['', [Validators.required]],
		// surface: ['', [Validators.required]],
		// sports: ['', [Validators.required]],
		// price: ['', [Validators.required]]
		/*email: ['', [Validators.required, Validators.pattern('[a-zA-Z\-0-9.]+@[a-zA-Z\-0-9]+.[a-zA-Z]{2,}')]],
		payment_address: ['', Validators.required],
		address: ['', Validators.required]*/

		// });
		this.coreService.getAllSports()
			.subscribe((response) => {
				this.sportOptions = response;
			},
			(error: any) => {
				this.error = error;
			});

		this.loadPitch();
		// this.addMore();

	}

	ngOnInit() {

	}
	initNames() {
		// return this.formBuilder.group({
		// 	name: ['', Validators.required]
		// });
	}

	formChanged() {
		setTimeout(() => {

			console.log("pitchFormGroupArray length", this.pitchFormGroupArray.length);
			console.log("deleteData length", this.deleteData.length);
			this.isFormValid = true;
			for (let fm of this.pitchFormGroupArray) {
				if (!fm.valid) {
					this.isFormValid = false;
					break;
				}
			}
		}, 100);
	}

	addValidationControls() {
		this.pitchFormGroupArray.push(this.formBuilder.group({
			name: ['', Validators.required],
			covering: ['', [Validators.required]],
			lights: ['', [Validators.required]],
			surface: ['', [Validators.required]],
			sports: ['', [Validators.required]],
			price: ['', [Validators.required]]
		}));
	}
	addMore() {


		console.log('add', this.pitches);
		// const control = <FormArray>this.pitchFormGroup.controls['names'];
		// control.push(this.initNames());

		this.addValidationControls();
		let tempPitch = <Pitch>{};
		tempPitch.scid = this.sub;
		this.pitches.push(tempPitch);
	}

	loadPitch() {
		this.coreService.loadPitches(this.sub)
			.subscribe((response) => {
				for (let res of response)
					this.addValidationControls();
				this.pitches = response;
				this.formChanged();
			},
			(error: any) => {
				this.success = '';
				this.error = error;
				// this._router.navigate(['/login']);
			});
	}


	removePitch(index) {

		if (this.pitches[index].id != null)
			this.deleteData.push(this.pitches[index].id)
		this.pitches.splice(index, 1);

		this.pitchFormGroupArray.splice(index, 1);
		console.log("pitchFormGroupArray lenght", this.pitchFormGroupArray.length);
	}

	SavePitch() {

		let dataPitches = JSON.stringify(this.pitches);
		let data = {
			"fields": this.pitches,
			"deleteids": this.deleteData
		};
		console.log("data", JSON.stringify(data));
		this.coreService.savePitches(JSON.stringify(data))
			.subscribe((response) => {
				console.log(response);
				this.error = '';
				this.success = response;
				this.loadPitch();
			},
			(error: any) => {
				this.success = '';
				this.error = error;
				// this._router.navigate(['/login']);
			});
	}

}