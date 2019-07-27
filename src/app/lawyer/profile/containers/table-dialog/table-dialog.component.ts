import { ProfessionalProfile } from './../../../../core/lawyer/professional-profile.interface';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from '@angular/material';

import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';
import { TableDialogColumn } from './table-dialog-column.interface';

@Component({
  selector: "app-profile-table-dialog",
  templateUrl: "./table-dialog.component.html",
  styleUrls: ["./table-dialog.component.scss"]
})
export class TableDialogComponent extends ProfileTabComponent implements OnInit {
  @Input() columns: TableDialogColumn[] = []; // table columns
  @Input() infoKey: string; // eg. 'practice_areas', 'experiences'
  @Input() addElementDialogComponent: any; // eg. AddPracticeAreaDialogComponent
  @Input() title: string;
  @Input() subtitle: string;
  headerColumns: string[];

  elements: Array<any> = [];
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(public dialog: MatDialog, protected profileService: ProfileService) {
    super(profileService);
  }

  onInit() {
    this.profileService.change.subscribe(() => {
      this.elements = this.profileService.profile.info[this.infoKey];
    });
    this.profileService.emitSaveButton(false);
    this.headerColumns = this.columns.map((column: TableDialogColumn) => { return column.name });
    this.headerColumns.push('actions');
  }

  openDialog(isEdit: boolean = false, element = {}, index: number = -1): void {
    let data = { isEdit: isEdit, element: element, index: index };
    const dialogRef = this.dialog.open(this.addElementDialogComponent, {
      data: data,
      maxWidth: '500px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data && data.element) {
        if (data.isEdit) {
          this.elements[index] = data.element;
        } else {
          this.elements.push(data.element);
        }
        this.profileService.changeInfo(this.infoKey, this.elements);
        this.table.renderRows();
      }
    });
  }

  deleteElement(element, index: number) {
    this.elements.splice(index, 1);
    this.profileService.changeInfo(this.infoKey, this.elements);
    this.table.renderRows();
  }

  // This is unused in this component since the form is in the dialog.
  form(): FormGroup {
    return null;
  }
}
