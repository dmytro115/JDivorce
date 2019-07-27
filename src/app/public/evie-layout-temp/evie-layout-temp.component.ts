import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, HostListener } from "@angular/core";
import { ClientService } from './../../core/client/client.service';
import { Router, ActivatedRoute } from "@angular/router";
import {
  AuthService,
  Client,
  BeginDivorceApplicationService
} from "../../core";

@Component({
  selector: 'app-evie-layout-temp',
  templateUrl: './evie-layout-temp.component.html',
  styleUrls: ['./evie-layout-temp.component.scss']
})

export class EvieLayoutTempComponent implements OnInit {
  client: Client;
  data;
  precheckCompleted = false;
  zip = '';
  haveDependents = 'N';
  shareTheCustody = 'N';
  first = false;
  second = false;
  third = false;
  showCookieNotification = false;
  showCookieNotificationSidebar = false;

  constructor(
    private router: Router,
    private beginDivorceApplicationService: BeginDivorceApplicationService,
    private authService: AuthService,
    private clientService: ClientService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // const cookieClosed = localStorage.getItem('cookieClosed');
    this.route.queryParams.subscribe(
      params => {
        if (params.gdpr && params.gdpr === 'true') {
          setTimeout(() => {
            this.showCookieNotification = true;
          }, 1000);
        }
      }
    );
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    // NAVIGATION BAR ON LANDING FIXED
    // If there is a #navConverter element then attach listener to scroll events
    if (document.body.contains(document.getElementById("navConverter"))) {
      var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
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
    }
    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) { elements = [elements]; }
    // add class to all chosen elements
    for (var i = 0; i < elements.length; i++) {
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
    }
    // if we have a single DOM element, make it an array to simplify behavior
    else if (elements.tagName) { elements = [elements]; }
    // create pattern to find class name
    var reg = new RegExp('(^| )' + myClass + '($| )', 'g');
    // remove class from all chosen elements
    for (var i = 0; i < elements.length; i++) {
      elements[i].className = elements[i].className.replace(reg, ' ');
    }
  }

  getOffset(el) {
    var _x = 0;
    var _y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: _y, left: _x };
  };

  beginApplication() {
    this.beginDivorceApplicationService.beginApplication("landing").subscribe(
      (client: Client) => {
        this.client = client;

        this.loadUpdates();
      },
      error => console.log(error),
    );
  }

  goToAdminDashboard(userData) {
    if (this.authService.isLawyer()) {
      this.router.navigate(["a/l/dashboard"]);
    } else {
      const url = userData.forms['PRECHECK'].actionUrl.split('?');
      const params = this.getQueryStringParams(url[1]);

      params['zip'] = this.zip ? this.zip : ''
      params['haveDependents'] = this.first ? 'Y' : 'N'
      params['shareTheCustody'] = (this.second && this.third) ? 'Y' : 'N'

      this.router.navigate([url[0]], { queryParams: params });
    }
  }

  getQueryStringParams(query) {
    return query
      ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          let [key, value] = param.split('=');
          params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
          return params;
        }, {}
        )
      : {}
  };

  loadUpdates() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.data = data;
        setTimeout(() => { this.precheckCompleted = data.precheck_completed; });

        this.goToAdminDashboard(this.data);
      },
      error => {
        console.log(error);
      }
    );
  }

  onCookieAccept() {
    localStorage.setItem("cookieClosed", 'true')
    this.showCookieNotification = false;
    this.showCookieNotificationSidebar = false;
  }

  showCookiePreferences() {
    localStorage.setItem("cookieClosed", 'true')
    this.showCookieNotification = false;
    this.showCookieNotificationSidebar = true;
  }

  toggleCookiePreferences() {

    localStorage.setItem("cookieClosed", 'true')
    this.showCookieNotification = false;

    this.showCookieNotificationSidebar = !this.showCookieNotificationSidebar;
  }

  onSavePreferences() {
    this.showCookieNotificationSidebar = false;
  }

}



