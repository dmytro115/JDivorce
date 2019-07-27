import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ScrollToTop } from '../scroll-to-top';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: [
      './faqs.component.scss'
  ]
})
export class FaqsComponent implements OnInit {
   @ViewChild('acc') accValue : ElementRef;
  questionStats = [
    { 'type': 'software', 'count': 9 },
    { 'type': 'common', 'count': 24 } 
  ];
  whiteheader:boolean = true;
  @Input() search: string;
  activeIds: string[] = [];
  showDropBox=true;
  qas: any = {'software': [], 'common': []};

  constructor(
    private translate: TranslateService,
    private location: Location,
    private router: Router,
    private scrollToTop: ScrollToTop) { }

  ngOnInit() {
    this.scrollToTop.scroll(this.router);
    for (let i = 0; i < this.questionStats.length; i++) {
      let type = this.questionStats[i]['type'];
      let count = this.questionStats[i]['count'];      
      for (let j = 0; j < count; j++){
        let qa = { 'question_key' : '', 'answer_key': ''};
        this.qas[type].push(qa);
        this.getTranslation('question_key', type + '.q_' + (j + 1), qa);
        this.getTranslation('answer_key', type + '.a_' + (j + 1), qa); 
      }       
    } 
    this.activeIds = ['panel-0'];
  }  

  getTranslation(key, translationKey, qa) {
    this.translate.get('faqs.' + translationKey).subscribe((res: string) => {         
        qa[key] = res;        
    });
  }
  getTitle = (qs) => {
    const response = this.translate.instant('faqs.' + qs.type);
    return response.title;
  }
  getSearchData(data, type, id){
    this.showDropBox=false;
    this.activeIds = ['panel-'+id];
  }
}