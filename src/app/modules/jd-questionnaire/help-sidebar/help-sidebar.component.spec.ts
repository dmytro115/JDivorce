;
import { async, ComponentFixture, TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { of, Observable, throwError } from 'rxjs';
import { By, BrowserModule } from '@angular/platform-browser';
import { RouterModule, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HelpSidebarService } from './help-sidebar.service'; 
import { HelpSidebarComponent } from './help-sidebar.component';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { sanitizeResourceUrl } from '@angular/core/src/sanitization/sanitization';

fdescribe('HelpSidebarComponent', () => {
  let component: HelpSidebarComponent;
  let fixture: ComponentFixture<HelpSidebarComponent>;
  let helpSidebarService: HelpSidebarService;
  let injector: TestBed;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterModule,
        RouterTestingModule,
        HttpClientTestingModule
        ],
      declarations: [ HelpSidebarComponent ],
      providers: [
        DomSanitizer
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit;
    injector = getTestBed();
    helpSidebarService = injector.get(HelpSidebarService);
    router = injector.get(Router);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle when clicked close',fakeAsync(() => {
    fixture.detectChanges();

    expect(spyOn(helpSidebarService, 'toggleSidebar'));
  }));
});
