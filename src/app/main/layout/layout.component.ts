import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../modules/dashboard/services/spinner.service';
import { SidenavService } from '../services/sidenav.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentChecked {
  showBackdrop = false;
  opened = false;
  closeOnClickOutside = false;
  closeOnClickBackdrop = false;
  dock = true;
  mode = 'push';
  spinnerInfo: { isLoading: boolean; isLoadingText: string };

  constructor(
    private readonly changeDetector: ChangeDetectorRef,
    private readonly sidenavService: SidenavService,
    private readonly spinnerService: SpinnerService
  ) {}

  onSidebarOpenedChange(opened: boolean): void {
    this.sidenavService.emitSidenavOpenedChange(opened);
  }

  ngOnInit(): void {
    this.sidenavService.toggleSideNav();
    this.onSidebarOpenedChange(this.opened);
    this.sidenavService.sidenavToggle$.subscribe(() => {
      this.toggleSidebar();
    });
    if ($('body').hasClass('is-mobile')) {
      this.opened = false;
      this.dock = false;
    } else {
      $('body').removeClass('mini-sidebar');
    }
  }

  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
    this.spinnerService.isLoadingListner.subscribe(response => {
      this.spinnerInfo = response;
    });
  }

  toggleSidebar(): void {
    this.opened = !this.opened;
  }

  // tslint:disable-next-line: no-empty
  _onClosed(): void {}
}
