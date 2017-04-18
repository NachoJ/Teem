import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from '../core/core.service';
import { Pitch } from '../shared/interface/pitch';

@Component({
	selector: 'app-pitch',
	templateUrl: './pitch.component.html',
	styleUrls: ['./pitch.component.scss'],
	encapsulation: ViewEncapsulation.None
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
	sportOptions = [];
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

	constructor(private coreService: CoreService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {
		this.sub = this.route.snapshot.params.scId;
		console.log("sub", this.sub);
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

	ngOnInit() { }

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
		this.formChanged();
	}

	loadPitch() {
		this.coreService.loadPitches(this.sub)
			.subscribe((response) => {
				// console.log("pitches load",response);
				for (let res of response) {
					console.log('pitch load')
					this.addValidationControls();
					this.pitches.push(res);
				}
				this.formChanged();
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// this.success = '';
				// this.error = error;
				// this._router.navigate(['/login']);
			});
	}


	removePitch(index) {

		if (this.pitches[index].id != null)
			this.deleteData.push(this.pitches[index].id)
		this.pitches.splice(index, 1);

		this.pitchFormGroupArray.splice(index, 1);
		console.log("pitchFormGroupArray lenght", this.pitchFormGroupArray.length);
		this.formChanged();

		// this.coreService.emitSuccessMessage('Pitch Removed Successfully.');
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
				// this.error = '';
				// this.success = response;
				this.coreService.emitSuccessMessage(response);
				this.router.navigate(['/my-sportscenter']);
				// this.loadPitch();
			},
			(error: any) => {
				this.coreService.emitErrorMessage(error);
				// this.success = '';
				// this.error = error;
				// this._router.navigate(['/login']);
			});
	}

}