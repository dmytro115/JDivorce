import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-pricing-option-description-bottom-sheet',
  templateUrl: 'pricing-option-description-bottom-sheet.component.html',
  styleUrls: ['./pricing-option-description-bottom-sheet.component.scss']
})
export class PricingOptionDescriptionBottomSheetComponent {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<PricingOptionDescriptionBottomSheetComponent>) {}

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
