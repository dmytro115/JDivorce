import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../core';

@Component({
  selector: 'app-finalization',
  templateUrl: './finalization.component.html',
  styleUrls: ['./finalization.component.scss']
})
export class FinalizationComponent implements OnInit {
  user;
  questionnaires = [];
  isLoaded: boolean = false;

  constructor(protected clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.user = data;
        const secondStage = data.forms_list_second_stage;
        const keys = Object.keys(secondStage);
        keys.forEach(id => { this.questionnaires.push(secondStage[id]); });
        this.isLoaded = true;
      },
      error => {
        console.log(error);
      }
    );
  }
}
