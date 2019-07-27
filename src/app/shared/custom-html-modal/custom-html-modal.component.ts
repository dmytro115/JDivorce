import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { CustomHtmlModalService } from './custom-html-modal.service';



@Component({
  selector: 'app-custom-html-modal',
  templateUrl: './custom-html-modal.component.html',
  styleUrls: ['./custom-html-modal.component.scss'],

})
export class CustomHtmlModalComponent implements OnInit {

  @Input() block:any;

  constructor(
    private modalService: CustomHtmlModalService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalService.hide();
    this.renderer.removeClass(document.body, 'disable-scroll');
  }

  onClickOutside() {
    this.closeModal();
  }
}
