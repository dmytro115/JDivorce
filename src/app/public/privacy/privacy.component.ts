import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToTop } from '../scroll-to-top';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  constructor(private router: Router, private scrollToTop: ScrollToTop) { }

  ngOnInit() {
    this.scrollToTop.scroll(this.router);
  }
}
