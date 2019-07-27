import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss']
})

export class CaseViewComponent implements OnInit {
  @Input()
  caseInfo: any;
  petitionerMarrigeAge: number;
  respondentMarrigeAge: number;

  constructor() {}

  ngOnInit() {
    $('.nav-items a').click(function() {
      var referElem = $(this).parents('.case-view-wrapper');
      var target = referElem.find('[data-section=' + $(this).data('nav-section') +']');
      if (target.length) {  
        $('html, body').animate({ 
          scrollTop: target.offset().top
        }, 1500); 
      } 
      return false;
    });

    const marrigeDate = new Date(this.caseInfo.marriage_date);
    const petitionerDob = new Date(this.caseInfo.petitioner_dob);
    const respondentDob = new Date(this.caseInfo.respondent_dob);

    this.petitionerMarrigeAge = marrigeDate.getFullYear() - petitionerDob.getFullYear();
    this.respondentMarrigeAge = marrigeDate.getFullYear() - respondentDob.getFullYear();
  }
}
