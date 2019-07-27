import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Validator from 'validatorjs';
import { LawyerProfileService } from '../../../../core';
import { ProfileTabComponent } from '../profile-tab.component';
import { ProfileService } from './../../profile.service';

@Component({
  selector: 'app-display-picture',
  templateUrl: './display-picture.component.html',
  styleUrls: ['./display-picture.component.scss']
})
export class DisplayPictureComponent extends ProfileTabComponent implements OnInit {
  uploadedImage: any;
  base64: string = undefined;
  imageForm: FormGroup;

  constructor(protected profileService: ProfileService, private readonly professionalProfileService: LawyerProfileService) {
    super(profileService);
  }

  onInit(): void {
    this.imageForm = new FormGroup({
      image: new FormControl('', Validators.required)
    });
    this.profileService.emitSaveButton(false);
  }

  form(): FormGroup {
    return this.imageForm;
  }

  getBase64(file: any, callback: any): void {
    const coolFile = {};
    function readerOnload(e): void {
      const base64 = btoa(e.target.result);
      coolFile['base64'] = base64;
      callback(coolFile);
    }

    const reader = new FileReader();
    reader.onload = readerOnload;

    coolFile['filetype'] = file.type;
    coolFile['size'] = file.size;
    coolFile['filename'] = file.name;
    reader.readAsBinaryString(file);
  }

  onDelete(): void {
    this.base64 = undefined;
    this.uploadedImage = undefined;
  }

  uploadFeaturedImage(): void {
    this.professionalProfileService
      .updateProfileImage(this.uploadedImage, this.base64)
      .subscribe(
        res => {
          this.profileService.fetchData();
          this.onDelete();
        },
        err => { console.log(err); }
      );
  }

  onImageSelect(e: any): void {
    if (e.target.value.length) {
      this.getBase64(e.target.files[0], result => {
        this.base64 = 'data:' + e.target.files[0].type + ';base64,' + result.base64;
      });
      this.uploadedImage = e.target.files[0];
    }
  }

  isValid(): boolean {
    const data = { picture: this.uploadedImage };
    const rules = { picture: 'required' };
    const validation = new Validator(data, rules);

    return validation.passes();
  }

  showPicture(): string {
    return this.profileService.profile && this.pictureUrl();
  }

  pictureUrl(): string {
    return this.profileService.profile.info.picture_url;
  }
}
