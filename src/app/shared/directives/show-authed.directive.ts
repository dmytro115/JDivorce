import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";

import { AuthService } from "src/app/core";

@Directive({ selector: "[showAuthed]" })
export class ShowAuthedDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<any>,
    private authService: AuthService,
    private viewContainer: ViewContainerRef
  ) {}

  condition: boolean;

  @Input() set showAuthed(condition: boolean) {
    this.condition = condition;
  }

  ngOnInit() {
    this.authService.isUserAuthenticated$.subscribe(isUserAuthenticated => {
      if (isUserAuthenticated && this.condition || !isUserAuthenticated && !this.condition) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
      }else {
        this.viewContainer.clear();
      }
    })
  }
}
