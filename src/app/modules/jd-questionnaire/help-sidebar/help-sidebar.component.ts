import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HelpSidebarService } from './help-sidebar.service';

@Component({
  selector: 'app-help-sidebar',
  templateUrl: './help-sidebar.component.html',
  styleUrls: ['./help-sidebar.component.scss']
})
export class HelpSidebarComponent implements OnInit {
  @Input() question: any;

  constructor(public sanitizer: DomSanitizer, private readonly helpSidebarService: HelpSidebarService) {}

  ngOnInit(): void {}

  close(): void {
    // no questionnaire on close
    this.helpSidebarService.toggleSidebar(undefined);
  }

  getVideoEmbedUrl(url: string): SafeResourceUrl {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = match && match[7].length === 11 ? match[7] : false;

    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}`);
  }
}
