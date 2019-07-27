import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./../../profile.service";
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { TableDialogColumn } from '../table-dialog/table-dialog-column.interface';
import { AddRecentCasesDialogComponent } from './add-recent-cases-dialog.component';

@Component({
  selector: "app-recent-cases",
  templateUrl: "./recent-cases.component.html",
  styleUrls: ["./recent-cases.component.scss"]
})
export class RecentCasesComponent implements OnInit {
  columns: TableDialogColumn[] = [
    { name: 'title', title: 'Description' }
  ]
  addElementDialogComponent = AddRecentCasesDialogComponent;
  infoKey: string = 'recent_cases';
  title: string = 'Recent Cases';
  subtitle: string = "Tell us about what you've been working on.";

  constructor() {
  }

  ngOnInit() {
  }
}
