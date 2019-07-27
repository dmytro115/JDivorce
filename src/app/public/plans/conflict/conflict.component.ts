import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../../scroll-to-top';

@Component({
  selector: 'app-conflict',
  templateUrl: './conflict.component.html',
  styleUrls: ['./conflict.component.scss']
})
export class ConflictComponent implements OnInit {
  planId = 3;

  constructor(
    private readonly router: Router,
    private readonly scrollToTop: ScrollToTop
  ) {}

  ngOnInit(): void {
    this.scrollToTop.scroll(this.router);
  }
}
