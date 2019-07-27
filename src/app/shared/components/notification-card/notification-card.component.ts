import { Component, Input, OnInit } from '@angular/core';
import { NotificationCardStyle } from './notification-card-style.enum';

@Component({
  selector: 'notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent implements OnInit {
  @Input() style: NotificationCardStyle = NotificationCardStyle.INFO;

  styles = {};

  constructor() {
    this.styles[NotificationCardStyle.INFO] = {
      background: 'background-primary',
      text: 'text-primary-contrast'
    };
  }

  // tslint:disable-next-line: no-empty
  ngOnInit(): void {}

  getClasses(): Array<string> {
    const classes = this.styles[this.style];

    return [classes.background, classes.text];
  }
}
