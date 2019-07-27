import { Component, HostListener, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ModalDialogService } from 'ngx-modal-dialog';
import { Subject } from 'rxjs';

import {
  AuthService,
  BeginDivorceApplicationService,
  Client
} from '../../core';

import { AuthDialogService } from '../../core/auth';

@Component({
  selector: 'app-evie-layout',
  templateUrl: './evie-layout.component.html',
  styleUrls: ['./evie-layout.component.scss']
})

export class EvieLayoutComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly beginDivorceApplicationService: BeginDivorceApplicationService,
    private readonly authService: AuthService,
    private readonly modalService: ModalDialogService,
    private readonly viewRef: ViewContainerRef,
    private readonly route: ActivatedRoute,
    private readonly authDialogService: AuthDialogService) { }

  ngOnInit() {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // NAVIGATION BAR ON LANDING FIXED
    // If there is a #navConverter element then attach listener to scroll events
    if (document.body.contains(document.getElementById('navConverter'))) {
      const lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // if the current body position is less than 20 pixels away from our converter, convert
      if (lastScrollTop > (this.getOffset(document.getElementById('navConverter')).top - 60)) {
        this.removeClass(document.querySelector('.navbar'), 'navbar--extended');
      } else {
        this.addNewClass(document.querySelector('.navbar'), 'navbar--extended');
      }
    }
  }

  addNewClass(elements, myClass) {
    // if there are no elements, we're done
    if (!elements) { return; }
    // if we have a selector, get the chosen elements
    if (typeof (elements) === 'string') {
      elements = document.querySelectorAll(elements);
    } else if (elements.tagName) { elements = [elements]; }
    // add class to all chosen elements
    for (let i = 0; i < elements.length; i++) {
      // if class is not already found
      if ((' ' + elements[i].className + ' ').indexOf(' ' + myClass + ' ') < 0) {
        // add class
        elements[i].className += ' ' + myClass;
      }
    }
  }

  removeClass(elements, myClass) {
    // if there are no elements, we're done
    if (!elements) { return; }

    // if we have a selector, get the chosen elements
    if (typeof (elements) === 'string') {
      elements = document.querySelectorAll(elements);
    } else if (elements.tagName) { elements = [elements]; }
    // create pattern to find class name
    const reg = new RegExp('(^| )' + myClass + '($| )', 'g');
    // remove class from all chosen elements
    for (let i = 0; i < elements.length; i++) {
      elements[i].className = elements[i].className.replace(reg, ' ');
    }
  }

  getOffset(el) {
    let _x = 0;
    let _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  }

  beginApplication() {
    this.beginDivorceApplicationService.beginApplication('landing').subscribe(
      (client: Client) => {
        this.router.navigate(['/a/c/questionnaire/precheck']);
      },
      error => console.log(error)
    );
  }

  goToAdminDashboard(userData) {
    if (this.authService.isLawyer()) {
      this.router.navigate(['a/l/dashboard']);
    } else {
      this.router.navigate(['/a/c/questionnaire/precheck']);
    }
  }

  triggerSignin(): void {
    this.authDialogService.openSigninDialog();
  }

  triggerSignup(): void {
    this.authDialogService.openSignupDialog({ registeredFrom: this.router.url });
  }
}
