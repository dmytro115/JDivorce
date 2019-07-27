import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { ConversationsComponent } from './conversations.component';
import { ConversationService } from './conversation.service';

@NgModule({
  declarations: [
    ConversationsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [ ConversationsComponent ]
})
export class ConversationsModule { }
