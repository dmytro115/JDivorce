import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../../profile.service";
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { TableDialogColumn } from '../table-dialog/table-dialog-column.interface';
import { AddPracticeAreaDialogComponent } from './add-practice-area-dialog.component';

@Component({
  selector: "app-practice-area",
  templateUrl: "./practice-area.component.html",
  styleUrls: ["./practice-area.component.scss"]
})
export class PracticeAreaComponent implements OnInit {
  columns: TableDialogColumn[] = [
    { name: 'title', title: 'Title' },
    { name: 'relative_percentage', title: 'Skill' },
  ]
  addElementDialogComponent = AddPracticeAreaDialogComponent;
  infoKey: string = 'practice_areas';
  title: string = 'Add a practice area';
  subtitle: string = "Tell us a bit about your practices.";

  constructor() {
  }

  ngOnInit() {
  }
}
