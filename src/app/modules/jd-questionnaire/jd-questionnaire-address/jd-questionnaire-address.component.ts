import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-address',
  templateUrl: './jd-questionnaire-address.component.html',
  styleUrls: ['./jd-questionnaire-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JDQuestionnaireAddressComponent implements OnInit {
  @Input() hasError = false;
  @Input() error = '';
  @Input() value: any;
  @Input() placeholder = 'Type your address here...';
  @Output() onAnswer = new EventEmitter();
  @ViewChild('search') searchInputField: ElementRef;

  service: any;
  placeService: any;
  predictions: any = [];
  activeIndex = 0;
  apartmentNumber: any;
  apartmentNumberPlaceholder: string;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.service = new google.maps.places.AutocompleteService();
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -33.866, lng: 151.196 },
      zoom: 17
    });
    this.placeService = new google.maps.places.PlacesService(map);
    if (this.value && this.value.full_address) {
      this.apartmentNumber = this.value.suite;
      this.searchInputField.nativeElement.value = this.value.full_address;
    }
    this.apartmentNumberPlaceholder = 'Unit #';
  }

  onInput(event: any): void {
    this.doSearch(event);
  }

  onBlur(event: any): void {
    setTimeout(() => {
      this.predictions = [];
      this.changeDetectorRef.detectChanges();
    }, 200);
  }

  onFocus(event: any): void {
    this.doSearch(event);
  }

  onKeyDown(event: any): void {
    const keyCode = event.key;

    if (this.predictions.length === 0) {
      return;
    }

    if (keyCode === 'ArrowUp') {
      event.preventDefault();
      if (this.activeIndex !== 0) {
        this.activeIndex--;
      }
      if (this.activeIndex === 0) {
        this.activeIndex = this.predictions.length;
      }
    }

    if (keyCode === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex++;
      if (this.activeIndex > this.predictions.length) {
        this.activeIndex = 1;
      }
    }

    if (this.activeIndex !== 0 && keyCode === 'Enter') {
      event.preventDefault();
      if (this.predictions[this.activeIndex - 1]) {
        this.searchInputField.nativeElement.value = this.predictions[this.activeIndex - 1].description;
        if (this.predictions[this.activeIndex - 1].place_id) {
          this.answerSubmit(this.predictions[this.activeIndex - 1].place_id);
        }
      }
      this.predictions = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  onClickItem(event: any, placeId: any): void {
    this.searchInputField.nativeElement.value = event.target.textContent;
    if (placeId) {
      this.answerSubmit(placeId);
    }
    this.predictions = [];
  }

  displaySuggestions(predictions: any, status: any): void {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      predictions = [];
    }

    this.predictions = predictions;
    this.changeDetectorRef.detectChanges();
  }

  doSearch(event: any): void {
    if (event.target.value) {
      this.service.getQueryPredictions({ input: event.target.value }, this.displaySuggestions.bind(this));
    } else {
      this.predictions = [];
      this.onAnswer.emit('');
    }
  }

  answerSubmit(placeId: any): void {
    const request = {
      placeId,
      fields: ['address_components']
    };

    this.placeService.getDetails(request, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        let zip = '';
        let country = '';
        let state = '';
        let city = '';
        let street = '';
        let streetNumber = '';

        for (const component in place['address_components']) {
          for (const i in place['address_components'][component]['types']) {
            if (place['address_components'][component]['types'][i] === 'postal_code') {
              zip = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'country') {
              country = place['address_components'][component]['short_name'];
            }
            if (place['address_components'][component]['types'][i] === 'administrative_area_level_1') {
              state = place['address_components'][component]['short_name'];
            }
            if (place['address_components'][component]['types'][i] === 'administrative_area_level_3' && city === '') {
              city = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'locality' && city == '') {
              city = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'route') {
              street = place['address_components'][component]['long_name'];
            }
            if (place['address_components'][component]['types'][i] === 'street_number') {
              streetNumber = place['address_components'][component]['long_name'];
            }
          }
        }

        const address = {
          full_address: this.searchInputField.nativeElement.value,
          display_address: this.buildDisplayAddress(zip),
          street,
          city,
          state,
          zip,
          country,
          streetNumber,
          suite: this.apartmentNumber
        };

        this.onAnswer.emit(address);
      }
    });
  }

  onFocusOutFlatNo(event: any): void {
    event.preventDefault();
    this.prepareAddress();
  }

  onKeyDownFlatNo(event: any): void {
    const keyCode = event.key;
    if (keyCode === 'Enter') {
      event.preventDefault();
      this.prepareAddress();
    }

    return;
  }

  prepareAddress(): void {
    if (!this.searchInputField.nativeElement.value && !this.value) {
      this.onAnswer.emit('');

      return;
    }

    const address = {
      full_address: this.searchInputField.nativeElement.value,
      display_address: this.buildDisplayAddress(this.value.zip),
      street: this.value.street,
      street_number: this.value.streetNumber,
      city: this.value.city,
      state: this.value.state,
      zip: this.value.zip,
      country: this.value.country,
      suite: this.apartmentNumber
    };
    this.onAnswer.emit(address);
    this.changeDetectorRef.detectChanges();
  }

  private buildDisplayAddress(zip: any): string {
    let fullAddress = this.searchInputField.nativeElement.value;
    if (this.apartmentNumber) {
      fullAddress = `#${this.apartmentNumber} ${fullAddress}`;
    }
    if (zip) {
      fullAddress = `${fullAddress}, ${zip}`;
    }

    return fullAddress;
  }
}
