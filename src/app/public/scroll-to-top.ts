import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class ScrollToTop {
  scroll(router: Router) {
    router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      var scrollToTop = window.setInterval(function() {
        var pos = window.pageYOffset;
        if (pos > 0) {
          window.scroll(0, 0); // how far to scroll on each step
        } else {
          window.clearInterval(scrollToTop);
        }
      }, 16); // how fast to scroll (this equals roughly 60 fps)
    });
  }
}
