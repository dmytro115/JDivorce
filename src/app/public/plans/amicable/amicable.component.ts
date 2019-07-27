import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../../scroll-to-top';

@Component({
  selector: 'app-amicable',
  templateUrl: './amicable.component.html',
  styleUrls: ['./amicable.component.scss']
})
export class AmicableComponent implements OnInit {
  planId = 0;

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
  }
}
