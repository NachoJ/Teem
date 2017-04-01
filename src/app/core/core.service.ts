import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
// import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/do';  // debug

import { environment } from '../../environments/environment';

@Injectable()
export class CoreService {

  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
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
    return this.http.put(environment.BASEAPI + environment.ADD_SPORTS_CENTER, data, this.options)
      .map((res: Response) => {
        return res.json();

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

  getAllSportsCenter() {
    return this.http.get(environment.BASEAPI + environment.GET_ALL_SPORTS_CENTERS, this.options)
      .map((res: Response) => {
        return res.json();

      }).catch(this.handleError);
    // .do(data => console.log('server data:', data))  // debug
  }

  deleteSportsCenter(id) {
    return this.http.delete(environment.BASEAPI + environment.DELETE_SPORTS_CENTER + id, this.options)
      .map((res: Response) => {
        return res.json();

      }).catch(this.handleError);
  }

  loadPitches() {
	  return this.http.get(environment.BASEAPI + environment.GET_FEILDS, this.options)
      .map((res: Response) => {
        return res.json();

      }).catch(this.handleError);
  }

  savePitches(data){
	return this.http.post(environment.BASEAPI + environment.ADD_FEILDS, data, this.options)
      .map((res: Response) => {
        return res.json();

      }).catch(this.handleError);
  }

  handleError(error: any) {
    return Observable.throw(error.json().error || 'Server error');
  }

}
