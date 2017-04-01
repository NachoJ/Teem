import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CoreService } from '../core/core.service';

declare var google: any;

@Component({
  selector: 'te-add-new-sportscenter',
  templateUrl: './add-new-sportscenter.component.html',
  styleUrls: ['./add-new-sportscenter.component.scss']
})
export class AddNewSportscenterComponent implements OnInit {

  map: any;
  public address: string;
  public name: string;
  public phone: string;
  public description: string;

  public message: string;

  public sportsCenterFormGroup: FormGroup;

  public sub: any;

  constructor(private coreService: CoreService, private formBuilder: FormBuilder, private route: ActivatedRoute) {

    this.sub = this.route.snapshot.params.updateId;
    if (this.sub) {

      console.log(this.sub);
      if (this.sub) {
        this.coreService.getSportsCenter(this.sub)
          .subscribe((response) => {
            console.log(response)
            this.name = response.data[0].name;
            this.address = response.data[0].address;
            this.phone = response.data[0].phone;
            this.description = response.data[0].description;
          },
          (error: any) => {
            this.message = error;
          });
      }
    }

    navigator.geolocation.getCurrentPosition(this.showPosition);
    
    this.sportsCenterFormGroup = this.formBuilder.group({
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern('^(0|[1-9][0-9]*)$')]],
      description: ['', [Validators.required]]
      /*email: ['', [Validators.required, Validators.pattern('[a-zA-Z\-0-9.]+@[a-zA-Z\-0-9]+.[a-zA-Z]{2,}')]],
      payment_address: ['', Validators.required],
      address: ['', Validators.required]*/
    });
  }
  showPosition(position) {
    console.log('lat = ' + position.coords.latitude);
    console.log('lon = ' + position.coords.longitude);
}

  ngOnInit() {
    this.initAutocomplete();
  }

  addSportsCenter() {
    let data = {
      name: this.name,
      address: this.address,
      phone: this.phone,
      description: this.description
      // description: ''
    };
    this.coreService.addNewSportsCenter(data)
      .subscribe((response) => {
        console.log(response)
        this.message = response.message;
      },
      (error: any) => {
        console.log(error);
        this.message = error;
        // this._router.navigate(['/login']);
      });
  }

  updateSportsCenter() {
    console.log("update record");
    let data = {
      id: this.sub,
      name: this.name,
      address: this.address,
      phone: this.phone,
      description: this.description
      // description: ''
    };
    this.coreService.updateSportsCenter(data)
      .subscribe((response) => {
        console.log(response)
        this.message = response.message;
      },
      (error: any) => {
        console.log(error);
        this.message = error;
        // this._router.navigate(['/login']);
      });
  }


  initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function (marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function (place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

}
