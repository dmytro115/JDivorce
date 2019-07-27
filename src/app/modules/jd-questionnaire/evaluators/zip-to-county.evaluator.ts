import { Injectable } from '@angular/core';
import { BaseEvaluator } from './base.evaulator';
import { EvaluatorExpression } from './evaluator-expression.model';

@Injectable({
  providedIn: 'root'
})
export class ZipToCountyEvaluator extends BaseEvaluator {
  private static readonly TYPE: string = 'ZIP_TO_COUNTY';
  private static readonly CACHE_KEY: string = 'ZIP_TO_COUNTY';
  private readonly geocoder: any;

  constructor() {
    super();
    this.geocoder = new google.maps.Geocoder();
    if (!localStorage.getItem(ZipToCountyEvaluator.CACHE_KEY)) {
      localStorage.setItem(ZipToCountyEvaluator.CACHE_KEY, JSON.stringify({}));
    }
  }

  get type(): string {
    return ZipToCountyEvaluator.TYPE;
  }

  evaluate(expression: EvaluatorExpression, answers: any): Promise<string> {
    return new Promise((resolve, reject) => {
      // `expression.qidSource` contains the question id.
      const zip = answers[expression.qidSource];

      if (zip && zip.length >= 5) {
        const county = this.getCountyFromCache(zip);
        if (county) {
          return resolve(county);
        }

        this.geocoder.geocode({ address: zip }, (results: Array<any>, status: any) => {
          if (status === google.maps.GeocoderStatus.OK) {
            this.handleGeocoderOK(results, zip, resolve);
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            return resolve(this.unknownZip(zip));
          }

          // Call geocode again with latlng: https://stackoverflow.com/questions/52754561/administrative-area-level-2-missing-in-some-places-results
          // https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
          const location = results[0]['geometry']['location'];
          const latlng = { lat: location.lat(), lng: location.lng() };
          this.geocoder.geocode({ location: latlng }, (results: Array<any>, status: any) => {
            if (status === google.maps.GeocoderStatus.OK) {
              this.handleGeocoderOK(results, zip, resolve);
            } else {
              console.error('Geocode was not successful for the following reason: ' + status);
              return resolve(this.unknownZip(zip));
            }
          });

          // We assume that the resolve has been returned before reaching this point.
        });
      } else {
        return resolve(this.unknownZip(zip));
      }
    });
  }

  handleGeocoderOK(results, zip, resolve) {
    if (results) {
      for (const component in results[0]['address_components']) {
        for (const i in results[0]['address_components'][component]['types']) {
          if (results[0]['address_components'][component]['types'][i] === 'administrative_area_level_2') {
            const county = results[0]['address_components'][component]['long_name'];
            this.updateCache(zip, county);
            return resolve(county);
          }
        }
      }
    } else {
      return resolve(this.unknownZip(zip));
    }
  }

  updateCache(zip: string, county: string): void {
    const cache = JSON.parse(localStorage.getItem(ZipToCountyEvaluator.CACHE_KEY));
    cache[zip] = county;
    localStorage.setItem(ZipToCountyEvaluator.CACHE_KEY, JSON.stringify(cache));
  }

  getCountyFromCache(zip: string): string {
    const cache = JSON.parse(localStorage.getItem('ZIP_TO_COUNTY'));
    if (!cache) {
      return undefined;
    }

    return JSON.parse(localStorage.getItem(ZipToCountyEvaluator.CACHE_KEY))[zip];
  }

  unknownZip(zip: string): string {
    if (!zip) {
      return 'Please enter your zip code.';
    } else if (zip.length <= 5) {
      return 'The zip [' + zip + '] is not valid.';
    } else {
      return 'The county cannot be found for the zip [' + zip + '].';
    }
  }
}
