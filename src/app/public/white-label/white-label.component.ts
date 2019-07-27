import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-white-label',
  templateUrl: './white-label.component.html',
  styleUrls: [
    './white-label.component.scss',
    '../../../assets/whitelabel/css/style.css'
  ]
})
export class WhiteLabelComponent implements OnInit {
  ngOnInit() {
    $('.navbar-nav a.nav-link').click(function() {  
      var target = $('#' + $(this).data('section'));
      if (target.length) {  
        $('html, body').animate({ 
          scrollTop: target.offset().top
        }, 1500); 
      } 
      return false; 
    });
  }
}
