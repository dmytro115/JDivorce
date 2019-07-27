import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressData } from './address-data.interface';

@Component({
  selector: 'app-google-address-input',
  templateUrl: './google-address-input.component.html',
  styleUrls: ['./google-address-input.component.scss']
})
export class GoogleAddressInputComponent implements OnInit {
  @Input() address: AddressData = {};
  @Input() placeholder = '';
  @Output() addressData: EventEmitter<AddressData> = new EventEmitter();

  addressForm: FormGroup;

  autocompleteService: any;
  placeService: any;
  predictions: any = [];

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.addressForm = new FormGroup({
      full_address: new FormControl(this.address.full_address, Validators.required),
      display_address: new FormControl(this.address.display_address),
      state: new FormControl(this.address.state),
      city: new FormControl(this.address.city),
      street: new FormControl(this.address.street),
      street_number: new FormControl(this.address.street_number),
      suite: new FormControl(this.address.suite),
      zip: new FormControl(this.address.zip)
    });

    this.autocompleteService = new google.maps.places.AutocompleteService();
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 17
    });
    this.placeService = new google.maps.places.PlacesService(map);
  }

  onInput(event) {
    this.doSearch(event);
  }

  onFocus(event) {
    this.doSearch(event);
  }

  onOptionSelected(event) {
    this.answerSubmit(event);
  }

  onChange(event) {
    this.addressData.emit(event.value);
  }

  displaySuggestions(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      predictions = [];
    }

    this.predictions = predictions;
    this.changeDetectorRef.detectChanges();
  }

  doSearch(event) {
    if (event.target.value) {
      this.autocompleteService.getQueryPredictions({ input: event.target.value }, this.displaySuggestions.bind(this));
    } else {
      this.predictions = [];
    }
  }

  answerSubmit(event) {
    const request = {
      placeId: event.option.id,
      fields: ['address_components']
    };

    this.placeService.getDetails(request, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let zipCode = '';
        let state = '';
        let city = '';
        let street = '';
        let street_number = '';
        let suite = '';

        for (const component in place['address_components']) {
          for (const i in place['address_components'][component]['types']) {
            if (place['address_components'][component]['types'][i] === 'postal_code') {
              zipCode = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'administrative_area_level_1') {
              state = place['address_components'][component]['short_name'];
            }
            if (place['address_components'][component]['types'][i] === 'administrative_area_level_3' && city == '') {
              city = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'locality' && city == '') {
              city = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'route') {
              suite = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'street_address') {
              street = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'street_number') {
              street_number = place['address_components'][component]['long_name'];
            }
          }
        }

        this.addressForm.get('zip').setValue(zipCode);
        this.addressForm.get('state').setValue(state);
        this.addressForm.get('city').setValue(city);
        this.addressForm.get('suite').setValue(suite);
        this.addressForm.get('street').setValue(street);
        this.addressForm.get('street_number').setValue(street_number);

        this.addressData.emit(this.addressForm.value);
      }
    });
  }

  isError() {
    const control = this.addressForm.controls['full_address'];
    const errors = control.errors;
    return errors && (control.dirty || control.touched);
  }
}
