import { ProfileComponent } from './../profile/profile.component';
import { CoreService } from './../../core/core.service';
import { environment } from './../../../environments/environment';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import { DomSanitizer } from "@angular/platform-browser";

declare var blobUtil: any;
declare var Cropper: any;
declare var $: any;

@Component({
	selector: 'app-user-profile-image',
	templateUrl: './user-profile-image.component.html',
	styleUrls: ['./user-profile-image.component.scss']
})
export class UserProfileImageComponent implements OnInit {
	logoname: FormControl = new FormControl('', Validators.required);
	flogoform: FormGroup;
	iscropperloading = false;
	// cropLogo: any;
	filename;
	loginUser;
	////////    
	imgSrc = '';
	cropper;
	previews = <any>{};

	isMobile: boolean = false;

	constructor(public sanitizer: DomSanitizer, private builder: FormBuilder, private coreservice: CoreService, public dialogRef: MdDialogRef<ProfileComponent>) {
		//    this.loginUser = this.authService.getUserFromLocalStorage();
		this.flogoform = builder.group({
			'logoname': this.logoname
		});
		if (!JSON.parse(window.localStorage.teem_user).profileimage) {
			this.imgSrc = '/assets/img/sidebar_photo.png'
		} else {
			this.imgSrc = environment.PROFILE_IMAGE_PATH + JSON.parse(window.localStorage.teem_user).profileimage;
		}

		// sanitizer.bypassSecurityTrustResourceUrl('./assets/img/dummyTally.png');
	}

	ngOnInit() {
		this.cropperInit();
		if (window.innerWidth <= 480) {
			this.isMobile = true;
		}
	}

	onCropperPopupDone() {
		let self = this;
		this.loginUser = window.localStorage.teem_user;
		this.filename = this.cropper.getCroppedCanvas().toDataURL('image/jpeg');
		this.iscropperloading = true;

		blobUtil.dataURLToBlob(this.filename).then(function (blob) {
			// console.log('blob', blob);
			self.loginUser = JSON.parse(self.loginUser);
			blob.lastModifiedDate = new Date();

			blob.name = self.loginUser.id + '.jpg';
			let formData = new FormData();

			formData.append('profile', blob, blob.name);
			// console.log('formData', formData);
			$.ajax(environment.BASEAPI + environment.PROFILE_IMAGE_UPDATE + self.loginUser.id, {
				method: 'POST',
				headers: {
					'Access-Control-Allow-Origin': '*'
					//   'Accept': 'application/json',
					//   'Authorization': authToken,
				},
				data: formData,
				processData: false,
				contentType: false,
				success: function (result) {
					console.log(' Upload success');
					console.log(JSON.stringify(result));
					self.profileImageEmit(result.data.data.profileimage);
					window.localStorage.teem_user = JSON.stringify(result.data.data);
					self.dialogRef.close();

					self.iscropperloading = false;
				},
				error: function (error) {
					let body = JSON.parse(error.responseText);
					console.log('public homepage setting Err handle', body.Message);
					self.iscropperloading = false;

					if (typeof body.Message !== 'undefined') {
						//   self.commonService.emitErrorMessage(body.Message);
					}
					console.log('Upload error');
				}
			});
		}).catch(function (err) {
			console.log('dataUrlToblob');
			console.log(err);
			alert(err);
		});
	}

	profileImageEmit(profile: any) {
		console.log("profile emit", profile);
		this.coreservice.profileImgEmit(profile);
	}

	cropperInit() {
		let self = this;
		console.log(this);

		// window.addEventListener('onclick', function () {
		$(document).ready(function () {
			var image = document.querySelector('#image');
			self.previews = document.querySelectorAll('.preview');
			self.cropper = new Cropper(image, {
				dragMode: 'move',
				cropBoxMovable: false,
				cropBoxResizable: false,
				checkOrientation: false,
				aspectRatio: 1 / 1,
				viewMode: 1,
				ready: function () {
					var clone = this.cloneNode();
					clone.className = ''
					clone.style.cssText = (
						'display: block;' +
						'width: 100%;' +
						'min-width: 0;' +
						'min-height: 0;' +
						'max-width: none;' +
						'max-height: none;'
					);
					each(self.previews, function (elem) {
						console.log(elem);
						elem.appendChild(clone.cloneNode(true));
					});
				},

				crop: function (e) {
					let data = e.detail;
					let cropper = this.cropper;
					let imageData = cropper.getImageData();
					let previewAspectRatio = data.width / data.height;

					each(self.previews, function (elem) {
						let previewImage = elem.getElementsByTagName('img').item(0);
						let previewWidth = elem.offsetWidth;
						let previewHeight = previewWidth / previewAspectRatio;
						let imageScaledRatio = data.width / previewWidth;

						elem.style.height = previewHeight + 'px';
						previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
						previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
						previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
						previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
					});
				}

			});
			function each(arr, callback) {
				let length = arr.length;
				for (let i = 0; i < length; i++) {
					callback.call(arr, arr[i], i, arr);
				}
				return arr;
			}
			// });
		});
	}
	// getting selected file 
	getImage(event) {
		let file = event.target.files[0];
		let fileUrl = URL.createObjectURL(file);
		this.imgSrc = fileUrl;
		let image = document.getElementById('image');
		// if (this.previews > 0) {
		console.log('if of getImage');

		for (let index = 0; index < this.previews.length; index++) {
			this.previews[index].children[0].remove();
		}
		// }
		this.cropper.replace(fileUrl);
		// this.cropper.initPreview();    
	}
}