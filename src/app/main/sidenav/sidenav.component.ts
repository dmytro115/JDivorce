import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, PNotifyService, ShareAppService } from '../../core';
import { WorkflowType } from '../../core/models/workflow-type.model';
import { SidenavService } from '../services/sidenav.service';
import { ShareAppDialogComponent } from './share-app-dialog.component';

interface NavNode {
  name: string;
  level: number;
  children?: Array<NavNode>;
  url: string;
  icon: string;
  title: string;
  img_src: string;
}

let TREE_DATA: Array<NavNode> = [];

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  url: string;
  icon: string;
  level: number;
  img_src: string;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
  activeSource = '';
  animationState = 'out';
  pnotify: any;
  opened = false;
  shareAppSwalOptions: any;
  menuItems: any = [];
  hiddenPages: any = [];
  isClient: boolean = this.authService.isClient();
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  readonly transformer = (node: NavNode, level: number) => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    url: node.url,
    icon: node.icon,
    level,
    img_src: node.img_src
  });
  // tslint:disable-next-line: member-ordering
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);
  // tslint:disable-next-line: member-ordering
  treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  // tslint:disable-next-line: member-ordering
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly shareAppService: ShareAppService,
    private readonly sidenavService: SidenavService,
    public dialog: MatDialog,
    pnotifyService: PNotifyService
  ) {
    this.pnotify = pnotifyService.get();
  }

  ngOnInit(): void {
    if (this.authService.isClient()) {
      this.menuItems.push(
        {
          img_src: '../../../assets/images/icons/sidenav/divorce-icon.svg',
          url: 'c/divorce',
          icon: 'mdi mdi-gauge',
          title: 'MENU.DASHBOARD',
          name: 'Divorce',
          children: [
            {
              img_src: '../../../assets/images/icons/sidenav/process.svg',
              url: 'c/divorce/process',
              icon: 'fa fa-reorder',
              title: 'MENU.TIMELINE',
              name: 'Process'
            }
          ]
        },
        {
          img_src: '../../../assets/images/icons/sidenav/domectic-violence.svg',
          url: 'c/domestic-violence',
          icon: 'mdi mdi-gauge',
          title: 'MENU.DASHBOARD',
          name: 'Domestic Violence',
          children: [
            {
              img_src: '../../../assets/images/icons/sidenav/process.svg',
              url: 'c/domestic-violence/process',
              icon: 'fa fa-reorder',
              title: 'MENU.TIMELINE',
              name: 'Process'
            }
          ]
        },
        {
          img_src: '../../../assets/images/icons/sidenav/hire-attorney.svg',
          url: 'c/checkout',
          icon: 'fa fa-legal',
          title: 'MENU.HIRE_ATTORNEY',
          name: 'Hire Atorney'
        },
        {
          img_src: '../../../assets/images/icons/sidenav/documents-icon.svg',
          url: 'c/uploaded-files',
          icon: 'fa fa-file-o',
          title: 'MENU.SUPPORTING_DOCS',
          name: 'My Files'
        },
        {
          img_src: '../../../assets/images/icons/sidenav/share-icon.svg',
          url: '#',
          icon: 'fa fa-share',
          title: 'MENU.SHARE_MY_APPLICATION',
          name: 'Share My Application'
        }
      );
      this.hiddenPages.push({ url: 'c/questionnaire', parent: 'c/dashboard' });
    } else {
      this.menuItems.push(
        {
          img_src: '../../../assets/images/icons/sidenav/speedometer.svg',
          url: 'l/clients',
          icon: 'mdi mdi-gauge',
          title: 'MENU.DASHBOARD',
          name: 'Dashboard'
        },
        {
          img_src: '../../../assets/images/icons/sidenav/curriculum.svg',
          url: 'l/profile',
          icon: 'far fa-user',
          title: 'MENU.PROFILE',
          name: 'Profile'
        }
      );
    }

    TREE_DATA = this.menuItems;
    this.dataSource.data = TREE_DATA;

    this.sidenavService.sidenavOpened$.subscribe((opened: boolean) => {
      this.opened = opened;
    });
  }

  isActive(url: string): boolean {
    let flag = false;

    // TODO: This will break if we change the order of the `source` param.
    WorkflowType.fragments().map(source => {
      if (this.router.url.split('=')[2] === source) {
        this.activeSource = `c/${source}`;

        return;
      }
    });

    if (this.router.url.indexOf(url) !== -1) {
      flag = true;
      this.activeSource = '';
    } else {
      // get current route
      const currentHiddenPage = this.hiddenPages.filter(page => this.router.url.includes(page.url));
      // if route found
      if (currentHiddenPage.length) {
        const parent = currentHiddenPage[0].parent;
        const parentRoute = this.menuItems.filter((page: any) => page.url === parent);
        // if has parent
        if (parentRoute.length) {
          // activate parent route

          if (parentRoute[0].url === url) {
            flag = true;
          }
        }
      }
    }

    return flag;
  }

  goToCheckoutPlans(): void {
    this.router.navigate(['/a/c/checkout']);
    this.activeSource = '';
  }

  onMiniMouseEnter(): void {
    if (!this.opened) {
      this.sidenavService.toggleSideNav();
    }
  }

  onMouseLeave(): void {
    if (this.opened && !this.sidenavService.largeDock) {
      this.sidenavService.toggleSideNav();
    }
  }

  closeSideBar(): void {
    if ($('body').hasClass('is-mobile')) {
      this.sidenavService.toggleSideNav();
    }
  }

  openShareAppDialog(): void {
    const dialogRef = this.dialog.open(ShareAppDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
}
