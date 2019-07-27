import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

import swal from 'sweetalert2';
import { AuthService, LawyerService, LawyerSettingsService } from '../../core';

@Component({
  selector: 'app-client-invite',
  templateUrl: './client-invite.component.html',
  styleUrls: ['./client-invite.component.scss']
})
export class ClientInviteComponent implements OnInit {
  inviteClientFrom: FormGroup;

  @Input()
  email = '';
  @Input()
  name = '';
  inviteIsProcessing = false;

  @Input()
  notify = false;
  alertText: string;

  constructor(
    public activeModal: MatDialogRef<ClientInviteComponent>,
    private readonly lawyerService: LawyerService,
    private readonly lawyerSettingsService: LawyerSettingsService,
    private readonly authService: AuthService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.inviteClientFrom = new FormGroup({
      invite_name: new FormControl(this.name, Validators.required),
      invite_email: new FormControl(this.email, [Validators.required, Validators.email]),
      invite_email_content: new FormControl('', Validators.required)
    });
    this.loadContent();
  }

  inviteClient(): void {
    const self = this;
    const client = {
      email: this.form().get('invite_email').value,
      name: this.form().get('invite_name').value
    };

    if (this.notify) {
      swal({
        title: this.translate.instant('swal.open_confirm_box_client.title'),
        text: this.translate.instant('swal.open_confirm_box_client.text'),
        type: 'warning'
      }).then(function(result) {
        if (result.value) {
          self.inviteIsProcessing = true;
          self.lawyerService.inviteClient(client).subscribe((data: any) => {
            self.activeModal.close();
            self.inviteIsProcessing = false;
          });
        }
      });
    } else {
      this.alertText = '';
      this.inviteIsProcessing = true;
      this.lawyerService.inviteClient(client).subscribe((data: any) => {
        this.inviteIsProcessing = false;
        if (data.code == 400) {
          this.alertText = data.error.message;
        } else {
          this.activeModal.close();
        }
      });
    }
  }

  loadContent(): void {
    this.lawyerSettingsService.show().subscribe((settings: any) => {
      this.form().get('invite_email_content').setValue(settings.client_invite_email.content);
    });
  }

  saveGeneralSettings() {
    this.lawyerService
      .saveGeneralSettings({ invite_email_content: this.form().get('invite_email_content').value })
      .subscribe((data: any) => {
        this.loadContent();
      });
  }

  form() {
    return this.inviteClientFrom;
  }

  isFieldError(key) {
    const control = this.form().controls[key];
    const errors = control.errors;

    return errors;
  }
}
