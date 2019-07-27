import { Component, EventEmitter, Input, OnInit, Output, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'jd-questionnaire-dropdown',
  templateUrl: './jd-questionnaire-dropdown.component.html',
  styleUrls: ['./jd-questionnaire-dropdown.component.scss']
})
export class JDQuestionnaireDropdownComponent implements OnInit {
  @Input()
  hasError: boolean = false;
  @Input()
  error: string = '';
  @Input()
  value: any = [];
  @Input()
  placeholder: string = "Type or select an option";
  @Input()
  style: string = "";
  @Input()
  options: any[] = [];
  @Input()
  enableNoneOfTheAbove: any;
  @Input()
  isActive: boolean = false;
  @Output()
  onAnswer = new EventEmitter();
  @Output()
  onActive = new EventEmitter();

  @ViewChild("search") searchInputField: ElementRef;

  filteredOptions: any[] = [];
  optionSelected: boolean = false;

  constructor() { }

  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.isActive = false;
  }

  ngOnInit() {
    this.filteredOptions = this.options;
    if (this.value && this.value.length > 0) {
      this.optionSelected = true;
      this.isActive = false;
    }
  }

  onSelect(event, value) {
    event.preventDefault();
    event.stopPropagation();
    const selected = [];
    if (value === -1) {
      selected.splice(0, selected.length);
      selected.push(-1);
    } else {
      if (selected.includes(-1)) {
        selected.splice(selected.indexOf(-1), 1);
      }
      if (selected.includes(value)) {
        selected.splice(selected.indexOf(value), 1);
      } else {
        selected.push(value);
      }
    }

    this.value = value;
    this.isActive = false;
    this.optionSelected = true;
    this.onAnswer.emit(selected);
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.isActive = !this.isActive;
    this.onActive.emit();
  }

  onSearchChange(searchValue: string) {
    if (!searchValue) this.optionSelected = false;
    this.filteredOptions = this.options.filter(item => {
      return item.value.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });

    this.isActive = true;
  }

  clearSelectedOption(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.optionSelected = false;
    this.filteredOptions = this.options;
    this.value = [];
    this.onAnswer.emit([]);
  }

  onBlur(event) {
    setTimeout(() => {
      this.isActive = false;
      if (!this.optionSelected) {
        this.searchInputField.nativeElement.value = [];
        this.filteredOptions = this.options;
      }
    } , 300);
  }
}
