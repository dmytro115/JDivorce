import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../../profile.service";
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { TableDialogColumn } from '../table-dialog/table-dialog-column.interface';
import { AddExperienceDialogComponent } from './add-experience-dialog.component';

import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: "app-experiences",
  templateUrl: "./experiences.component.html",
  styleUrls: ["./experiences.component.scss"]
})
export class ExperiencesComponent implements OnInit {
  columns: TableDialogColumn[] = [
    { name: 'title', title: 'Title' },
    { name: 'subtitle', title: 'Organization' },
    { name: 'from_timestamp', title: 'From' },
    { name: 'to_timestamp', title: 'To' }
  ]
  addElementDialogComponent = AddExperienceDialogComponent;
  infoKey: string = 'experiences';
  title: string = 'Add a work experience';
  subtitle: string = "Tell us a bit about what you've been working on.";

  constructor() {
  }

  ngOnInit() {
  }
}
