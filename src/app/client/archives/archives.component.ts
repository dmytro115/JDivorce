import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../core';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.scss']
})
export class ArchivesComponent implements OnInit {
  similarCases: any = [];
  constructor(private readonly clientService: ClientService) {}

  ngOnInit() {
    this.getSimilarCases();

    const displayStickyNavItem = function() {
      const sticky = $('.stickyside'),
        scroll = $(window).scrollTop(),
        selectedCaseViewIndex = sticky.find('a.active').data('section');

      if (scroll >= $('#index-' + selectedCaseViewIndex).offset().top) {
        sticky.width(sticky.parent().width());
        sticky.addClass('fixed');
      } else {
        sticky.width('inherit');
        sticky.removeClass('fixed');
      }
    };

    $(window).on('scroll', displayStickyNavItem);
    $(window).on('resize', displayStickyNavItem);
  }

  switchCaseView(e) {
    if ($(e.target).hasClass('active')) {
      return;
    }

    const target = $(e.target).data('section');
    $(e.target)
      .addClass('active')
      .siblings()
      .removeClass('active');
    $('#index-' + target)
      .removeClass('hide')
      .siblings()
      .addClass('hide');
  }

  getSimilarCases() {
    this.clientService.getSimilarCases().subscribe(
      data => {
        this.similarCases = data.response;
      },
      error => {
        console.log(error);
      }
    );
  }
}
