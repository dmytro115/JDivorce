import { Component, OnInit } from "@angular/core";
import {
  AuthService,
  Client,
  BeginDivorceApplicationService
} from "../../core";

import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { environment } from "../../../environments/environment";

@Component({
  selector: "app-landing-variant",
  templateUrl: "./landing-variant.component.html",
  styleUrls: ["./landing-variant.component.scss"]
})
export class LandingVariantComponent implements OnInit {
  client: Client;

  constructor(
    private router: Router,
    private beginDivorceApplicationService: BeginDivorceApplicationService,
    private authService: AuthService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}

  beginApplication() {
    this.beginDivorceApplicationService.beginApplication('landing').subscribe(
      (client: Client) => {
        this.client = client;
        console.log(this.client);
      },
      error => console.log(error),
      () => {
        this.router.navigate(["a/c/dashboard"]);
      }
    );
  }

  hireLawyer() {
    this.beginDivorceApplicationService.beginApplication('hire').subscribe(
      (client: Client) => {
        this.client = client;
      },
      error => console.log(error),
      () => {
        this.router.navigate(["a/c/checkout"]);
      }
    );
  }
}
