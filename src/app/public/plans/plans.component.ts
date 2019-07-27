import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LawyerProfileService } from '../../core';
import { ScrollToTop } from '../../public/scroll-to-top';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  @Input() planId: number;
  defaultPlans: Array<any> = [];

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop,
    private readonly professionalProfileService: LawyerProfileService
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
    this.professionalProfileService.showDefaultPlans().subscribe((plans: Array<any>) => {
      this.defaultPlans = plans[this.planId];
    });
  }
}
