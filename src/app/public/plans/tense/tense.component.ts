import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../../scroll-to-top';

@Component({
  selector: 'app-tense',
  templateUrl: './tense.component.html',
  styleUrls: ['./tense.component.scss']
})
export class TenseComponent implements OnInit {
  planId = 2;

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
  }
}
