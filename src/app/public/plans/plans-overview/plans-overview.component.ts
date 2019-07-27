import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../../scroll-to-top';

@Component({
  selector: 'app-plans-overview',
  templateUrl: './plans-overview.component.html',
  styleUrls: ['./plans-overview.component.scss']
})
export class PlansOverViewComponent implements OnInit {
  planId = 0;

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
  }
}
