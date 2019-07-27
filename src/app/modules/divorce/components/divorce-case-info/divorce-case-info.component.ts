import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../../core';

@Component({
  selector: 'app-divorce-case-info',
  templateUrl: './divorce-case-info.component.html',
  styleUrls: ['./divorce-case-info.component.scss']
})
export class DivorceCaseInfoComponent implements OnInit {
  user;
  questionnaires = [];
  isLoaded: boolean = false;

  constructor(protected clientService: ClientService) { }

  ngOnInit() {
    this.clientService.getAndUpdateLs().subscribe(
      data => {
        this.user = data;
        const firstStage = data.forms_list_first_stage;
        const keys = Object.keys(firstStage);
        keys.forEach(id => { this.questionnaires.push(firstStage[id]); });
        this.isLoaded = true;
      },
      error => {
        console.log(error);
      }
    );
  }
}
