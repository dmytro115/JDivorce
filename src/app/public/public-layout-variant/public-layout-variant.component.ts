import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Client, BeginDivorceApplicationService } from "../../core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core";

@Component({
  selector: "app-public-layout-variant",
  templateUrl: "./public-layout-variant.component.html",
  styleUrls: ["./public-layout-variant.component.scss"]
})
export class PublicLayoutVariantComponent implements OnInit {
  @ViewChild("signInForm")
  signInForm;
  @ViewChild("signUpForm")
  signUpForm;

  client: Client;
  toggle: boolean = true;
  langIcon: string = "flag-icon-us";

  constructor(
    private router: Router,
    private translate: TranslateService,
    private beginDivorceApplicationService: BeginDivorceApplicationService,
    private authService: AuthService
  ) {}

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    this.toggle = true; // window.pageYOffset > 80;
  }

  ngOnInit() {}

  beginApplication() {
    this.beginDivorceApplicationService.beginApplication("navbar").subscribe(
      (client: Client) => {
        this.client = client;
      },
      error => console.log(error),
      () => {
        this.goToDashboard();
      }
    );
  }

  goToDashboard() {
    if (this.authService.isLawyer()) {
      this.router.navigate(["a/l/dashboard"]);
    } else {
      this.router.navigate(["a/c/dashboard"]);
    }
  }

  goToSignIn() {
    this.signInForm.show(this.signInForm, this.signUpForm);
  }

  goToSignUp() {
    this.signUpForm.show(this.signInForm, this.signUpForm);
  }

  updateLanguage(langCode) {
    this.langIcon = langCode === "en" ? "flag-icon-us" : "flag-icon-mx";
    this.translate.use(langCode);
  }
}
