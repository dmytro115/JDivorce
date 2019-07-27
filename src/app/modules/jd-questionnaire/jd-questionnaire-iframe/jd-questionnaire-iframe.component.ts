import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-iframe',
  templateUrl: './jd-questionnaire-iframe.component.html',
  styleUrls: ['./jd-questionnaire-iframe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JDQuestionnaireIframeComponent implements OnInit {
  _url: any
  @Input()
  set url(value: any) {
    const currentUrl = this._url ? this._url.changingThisBreaksApplicationSecurity : null
    const newUrl = value ? value.changingThisBreaksApplicationSecurity : null
    if (currentUrl !== newUrl) {
      this._url = value;
    }
  }
  constructor() { }
  ngOnInit() {
  }

}
