import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from '../modules/angular-material/angular-material.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  exports: [HttpClientModule, AngularMaterialModule, SharedModule, ReactiveFormsModule, FormsModule, BrowserModule, BrowserAnimationsModule]
})
export class TestModule {}
