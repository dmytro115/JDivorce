import { Injectable, OnInit } from '@angular/core';
import { MixpanelService } from '../../../../core/mixpanel/mixpanel.service';

@Injectable()
export abstract class DashboardTabComponent implements OnInit {

  constructor(protected mixpanel: MixpanelService) { }

  ngOnInit() {
    this.onInit();
  }

  abstract onInit(): void;
}
