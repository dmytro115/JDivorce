import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelpSidebarService } from './help-sidebar/help-sidebar.service';

@Component({
  selector: 'app-jd-questionnaire',
  templateUrl: './jd-questionnaire.component.html',
  styleUrls: ['./jd-questionnaire.component.scss']
})
export class JDQuestionnaireComponent implements OnInit {
  @Input() questionnaireType: string;
  @Input() continueButtonUrl: string;
  @Input() continueButtonText = 'Continue';
  @Input() submitText = 'Submit';
  @Input() successMessage = 'Thanks!';
  @Input() questions: Array<any>;
  @Input() isLoading = false;
  @Input() isCompleted = false;
  @Input() isFailed = false;
  @Output() questionnaireSubmit = new EventEmitter();

  position = 'right';
  showBackdrop = false;
  opened = false;
  closeOnClickOutside = true;
  closeOnClickBackdrop = true;
  dock = false;
  mode = 'over';
  sidebarQuestion: any;

  constructor(private readonly helpSidebarService: HelpSidebarService) {}

  ngOnInit(): void {
    this.helpSidebarService.sidebarToggle$.subscribe((question: any) => {
      this.sidebarQuestion = question;
      this.toggleSidebar();
    });
  }

  onSidebarOpenedChange(opened: boolean): void {}

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  onSubmit($event: Event): void {
    this.questionnaireSubmit.emit($event);
  }
}
