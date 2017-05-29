import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/do';  // debug

import { Subject } from 'rxjs/Subject';

@Injectable()
export class CoreService {

	headers: Headers;
	options: RequestOptions;

	private sportIcon = new Subject<any>();
	private profileImage = new Subject<any>();
	private userEmit = new Subject<any>();

	sportIcon$ = this.sportIcon.asObservable();
	profileImage$ = this.profileImage.asObservable();
	userEmit$ = this.userEmit.asObservable();

	private successMessageSource = new Subject<string>();
	successMessage$ = this.successMessageSource.asObservable();

	private errorMessageSource = new Subject<string>();
	errorMessage$ = this.errorMessageSource.asObservable();

	constructor(private http: Http) {
		this.headers = new Headers({ 'Content-Type': 'application/json' });
		this.options = new RequestOptions({ headers: this.headers });
	}

	emitSuccessMessage(msg: string) {
		this.successMessageSource.next(msg);
	}

	emitErrorMessage(msg: string) {
		this.errorMessageSource.next(msg);
	}

	addNewSportsCenter(user) {
		let data = JSON.stringify(user);
		console.log(data);
		return this.http.post(environment.BASEAPI + environment.ADD_SPORTS_CENTER, data, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
		// .do(data => console.log('server data:', data))  // debug
	}

	updateSportsCenter(user) {
		let data = JSON.stringify(user);
		console.log(data);
		return this.http.put(environment.BASEAPI + environment.ADD_SPORTS_CENTER, data)
			.map((res: Response) => {
				return res.json().message;

			}).catch(this.handleError);
		// .do(data => console.log('server data:', data))  // debug
	}

	getSportsCenter(id) {
		return this.http.get(environment.BASEAPI + environment.GET_SPORTS_CENTERS + id, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
		// .do(data => console.log('server data:', data))  // debug
	}

	getAllSportsCenter(userid) {
		return this.http.get(environment.BASEAPI + environment.GET_ALL_SPORTS_CENTERS_USER + userid, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
		// .do(data => console.log('server data:', data))  // debug
	}

	deleteSportsCenter(id) {
		return this.http.delete(environment.BASEAPI + environment.DELETE_SPORTS_CENTER + id, this.options)
			.map((res: Response) => {
				return res.json().message;

			}).catch(this.handleError);
	}

	loadPitches(id) {
		return this.http.get(environment.BASEAPI + environment.GET_FEILDS + id, this.options)
			.map((res: Response) => {
				//   console.log("pitches = ",res.json().data)
				return res.json().data;

			}).catch(this.handleError);
	}

	savePitches(data) {
		return this.http.post(environment.BASEAPI + environment.ADD_FEILDS, data, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
	}

	loadSportCentreAutoComplete(input) {
		return this.http.get(environment.BASEAPI + environment.AUTOCOMPLETE_SPORTSCENTRE + input, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
	}

	getAllCurrency() {
		return this.http.get(environment.BASEAPI + environment.GET_ALL_CURRENCY, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	getAllSports() {
		return this.http.get(environment.BASEAPI + environment.GET_ALL_SPORTS_WITH_SUB, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}
	getMainSports() {
		return this.http.get(environment.BASEAPI + environment.GET_SPORT, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	createMatch(data) {
		return this.http.post(environment.BASEAPI + environment.CREATE_MATCH, data, this.options)
			.map((res: Response) => {
				return res.json();

			}).catch(this.handleError);
	}

	getMatch(id) {
		return this.http.get(environment.BASEAPI + environment.GET_MATCH + id, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	getLatLongByCityName(cityName) {
		return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + environment.GoogleKey)
			.map((res: Response) => {
				return res.json().results[0].geometry.location;

			}).catch(this.handleError);
	}

	getAddressFromLatLong(lat: string, lng: string) {
		let latlng = "latlng=" + lat + "," + lng;
		return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?" + latlng + environment.GoogleKey)
			.map((res: Response) => {
				return res.json().results[0].formatted_address;

			}).catch(this.handleError);
	}

	getNearByMatch(data) {
		return this.http.post(environment.BASEAPI + environment.NEARBY_MATCH, data, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	sportIconDisplay(data: any) {
		console.log('service data', data);
		this.sportIcon.next(data);
	}
	profileUpdate(data) {
		return this.http.post(environment.BASEAPI + environment.PROFILE_UPDATE, data, this.options)
			.map((res: Response) => {

				return res.json();
			}).catch(this.handleError);
	}

	getBenchPlayers(sport) {
		return this.http.get(environment.BASEAPI + environment.GET_BENCH_PLAYERS + sport, this.options)
			.map((res: Response) => {
				return res.json().data.players;

			}).catch(this.handleError);
	}

	getSubSports(sportData) {
		return this.http.post(environment.BASEAPI + environment.GET_SUB_SPORTS, sportData, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	getInvitationSearchPlayer(search) {
		let id = JSON.parse(window.localStorage['teem_user']).id;
		return this.http.get(environment.BASEAPI + environment.INVITATION_SEARCH_PLAYER + search + '/' + id, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	sendInvitations(data) {
		return this.http.post(environment.BASEAPI + environment.SEND_INVITATIONS, data, this.options)
			.map((res: Response) => {
				return res.json().message;

			}).catch(this.handleError);
	}

	//   profileImageUpload(data:any){
	//      let headers = new Headers();
	//         headers.append('Content-Type', 'multipart/form-data');
	//         headers.append('Accept', 'application/json');
	//         let options = new RequestOptions({ headers: headers });
	//         console.log('service data',data);
	// 		let input = new FormData();
	//     input.append("uploads", data);
	//         return this.http.post(environment.BASEAPI + environment.PROFILE_IMAGE_UPDATE,input,this.options)
	//           .map((res:Response)=>{
	//               return res.json();
	//           }).catch(this.handleError);
	//   }

	//   makeFileRequest(url: string, params: string[], files: File[]): Observable<any> {
	//             return Observable.create(observer => {
	//         let formData: FormData = new FormData(),
	//             xhr: XMLHttpRequest = new XMLHttpRequest();

	//         for (let i = 0; i < files.length; i++) {
	//             formData.append("uploads[]", files[i], files[i].name);
	//         }

	//         xhr.onreadystatechange = () => {
	//             if (xhr.readyState === 4) {
	//                 if (xhr.status === 200) {

	//                     observer.next(JSON.parse(xhr.response));
	//                     observer.complete();
	//                 } else {
	//                     observer.error(xhr.response);
	//                 }
	//             }
	//         };

	//         // xhr.upload.onprogress = (event) => {
	//         //     this.progress = Math.round(event.loaded / event.total * 100);

	//         //     this.progressObserver.next(this.progress);
	//         // };

	//         xhr.open('POST', url, true);
	//         xhr.send(formData);
	//     }); 
	// }
	profileImgEmit(img: any) {
		this.profileImage.next(img);
	}
	userDetailEmit(user: any) {
		this.userEmit.next(user);
	}

	passwordUpdate(pass: any) {
		return this.http.post(environment.BASEAPI + environment.UPDATE_PASSWORD, pass, this.options)
			.map((res: Response) => {
				console.log("res", res);
				let body = res.json().message;
				return body;
			}).catch(this.handleError);
	}

	changeEmail(data: any) {
		console.log("data", data);
		return this.http.post(environment.BASEAPI + environment.CHANGE_EMAIL, data, this.options)
			.map((res: Response) => {
				console.log('res', res);
				let body = res.json().message;
				return body;
			}).catch(this.handleError);
	}
	updateEmail(data: any) {
		console.log("data", data);
		return this.http.get(environment.BASEAPI + environment.CHANGE_EMAIL + '/' + data)
			.map((res: Response) => {
				console.log('res', res);
				let body = res.json();
				return body;
			}).catch(this.handleError);
	}

	getNextMatch(id, date) {
		return this.http.get(environment.BASEAPI + environment.GET_MATCH_USER + id + "/" + date, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	getInvitation(id, date) {
		return this.http.get(environment.BASEAPI + environment.INVITATION_SEARCH_USER + id + "/" + date, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}
	acceptInvitation(id: any, inviteid: any) {
		return this.http.get(environment.BASEAPI + environment.INVITATION_ACCEPT + id + '/' + inviteid, this.options)
			.map((res: Response) => {
				return res.json().message;
			}).catch(this.handleError);
	}
	deleteInvitation(id: any) {
		return this.http.delete(environment.BASEAPI + environment.INITATION_DELETE + id, this.options)
			.map((res: Response) => {
				return res.json().message;
			}).catch(this.handleError);
	}
	joinMatch(user) {
		return this.http.post(environment.BASEAPI + environment.JOIN_MATCH, user, this.options)
			.map((res: Response) => {
				return res.json().message;
			}).catch(this.handleError);
	}
	leaveMatch(matchid, userid) {
		return this.http.delete(environment.BASEAPI + environment.DELETE_MATCH + userid + '/' + matchid, this.options)
			.map((res: Response) => {
				return res.json().message;
			}).catch(this.handleError);
	}
	getLastMatch(id, date) {
		return this.http.get(environment.BASEAPI + environment.GET_LAST_MATCH + id + "/" + date, this.options)
			.map((res: Response) => {
				return res.json().data;

			}).catch(this.handleError);
	}

	shortUrl(mUrl) {
		let data = {
			"longUrl": mUrl
		};
		return this.http.post(environment.GOOGLE_URL_SHORTER, data, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	loadSearch(value,userid) {
		return this.http.get(environment.BASEAPI + environment.SEARCH + value+'/'+userid, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	getUser(id){
		return this.http.get(environment.BASEAPI + environment.GET_SEARCH_USER + id, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	followUser(userId, followId) {
		let data = {
			"userid": userId,
			"followinguserid": followId
		};
		return this.http.post(environment.BASEAPI + environment.FOLLOW_USER, JSON.stringify(data), this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	unFollowUser(userId, followId) {
		return this.http.delete(environment.BASEAPI + environment.UNFOLLOW_USER + userId + "/" + followId, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	sportcenterView(scid:any){
		return this.http.get(environment.BASEAPI+environment.GET_SEARCH_SPORTCENTER+scid,this.options)
				.map((res:Response)=>{
					return res.json();
				})
				.catch(this.handleError);
	}

	followSportcenter(userId,scId){
			let data = {
			"userid": userId,
			"scid": scId
		};
		return this.http.post(environment.BASEAPI + environment.FOLLOW_SPORTCENTER, JSON.stringify(data), this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	unFollowSc(userId,scId){
		return this.http.delete(environment.BASEAPI + environment.UNFOLLOW_SPORTCENTER + userId + "/" + scId, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}
	getFollowing(userId){
		return this.http.get(environment.BASEAPI + environment.GET_FOLLOWING + userId, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	getFollowers(userId){
		return this.http.get(environment.BASEAPI + environment.GET_FOLLOWERS + userId, this.options)
			.map((res: Response) => {
				return res.json();
			}).catch(this.handleError);
	}

	handleError(error: any) {
		console.log("res", error);
		return Observable.throw(error.json().error || 'Server error');
	}

}
