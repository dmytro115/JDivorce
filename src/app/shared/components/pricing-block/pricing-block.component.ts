import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { LawyerProfileService } from '../../../core';
import { CustomHtmlModalService } from '../../custom-html-modal/custom-html-modal.service';
import { PricingOptionDescriptionBottomSheetComponent } from './pricing-option-description-bottom-sheet.component';

@Component({
  selector: 'app-pricing-block',
  templateUrl: './pricing-block.component.html',
  styleUrls: ['./pricing-block.component.scss']
})
export class PricingBlockComponent implements OnInit {
  @ViewChild('detailsModal') detailsModal: ElementRef;
  @Input() ctaButtonOptions = {};
  @Input() plansFilter: Array<number> = [];
  // emits the plan that's clicked on
  @Output() ctaClick: EventEmitter<any> = new EventEmitter<any>();
  @Input() highlightPlanIds: Array<number> = [];
  @Input() inputPlans: Array<any> = [];

  defaultPlans: Array<any> = [];
  planStepPictures: Array<string> = [
    'undraw_designer',
    'undraw_responsive',
    'undraw_browser',
    'undraw_designer',
    'undraw_creation'
  ];

  constructor(
    private readonly modalService: CustomHtmlModalService,
    private readonly renderer: Renderer2,
    private readonly professionalProfileService: LawyerProfileService,
    private readonly bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    if (this.inputPlans.length) {
      this.defaultPlans = this.inputPlans;
    } else {
      this.professionalProfileService.showDefaultPlans().subscribe((plans: Array<any>) => {
        if (this.plansFilter.length) {
          this.defaultPlans = plans.filter(plan => this.plansFilter.includes(plan.id));
        } else {
          this.defaultPlans = plans;
        }
      });
    }
  }

  openOptionInfo(optionDescription: string): void {
    this.bottomSheet.open(PricingOptionDescriptionBottomSheetComponent, {
      data: { description: optionDescription },
      panelClass: ['max-width-400', 'background-primary']
    });
  }

  ctaOnClick(plan): void {
    this.ctaClick.emit(plan);
  }

  highlightPlan(plan): boolean {
    if (this.highlightPlanIds.length) {
      return this.highlightPlanIds.includes(plan.id);
    } else {
      return true;
    }
  }

  openDetails(): void {
    this.renderer.addClass(document.body, 'disable-scroll');
    this.modalService.show(this.detailsModal.nativeElement.innerHTML);
  }
}
