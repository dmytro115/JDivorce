import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../../scroll-to-top';

@Component({
  selector: 'app-kidsville',
  templateUrl: './kidsville.component.html',
  styleUrls: ['./kidsville.component.scss']
})
export class KidsVilleComponent implements OnInit {
  planId = 1;

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
  }
}
