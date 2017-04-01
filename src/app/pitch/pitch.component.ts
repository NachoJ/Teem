import { Component, OnInit } from '@angular/core';
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

	message: string;
	name: string;
	covering: string;
	lights: string;
	surface: string;
	surfaceOptions = [
		{ value: 'option1', viewValue: 'option1' },
		{ value: 'option2', viewValue: 'option2' },
		{ value: 'option3', viewValue: 'option3' }
	];
	sports: string;
	sportsOptions = [
		{ value: 'option1', viewValue: 'option1' },
		{ value: 'option2', viewValue: 'option2' },
		{ value: 'option3', viewValue: 'option3' }
	];
	price: string;

	pitches: Pitch[] = [];

	private sub: any;

	public pitchFormGroup: FormGroup;

	constructor(private coreService: CoreService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
		this.sub = this.route.snapshot.params.scId;
		console.log("sub",this.sub);
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
		this.addMore();

	}

	ngOnInit() {
	}

	addMore() {
		let tempPitch = <Pitch>{};
		tempPitch.scid = this.sub;
		this.pitches.push(tempPitch);
	}

	removePitch(index) {
		this.pitches.splice(index, 1);
	}

	SavePitch() {
		let deleteData = {};
		let dataPitches = JSON.stringify(this.pitches);
		console.log('dataPitches', JSON.stringify(dataPitches));
		let data = {
			"fields": this.pitches,
			"deleteids": deleteData
		};
		console.log("data",JSON.stringify(data));
		this.coreService.savePitches(JSON.stringify(data))
			.subscribe((response) => {
				console.log(response)
				this.message = response;
			},
			(error: any) => {
				this.message = error;
				// this._router.navigate(['/login']);
			});
	}

}