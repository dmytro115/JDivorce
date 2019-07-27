import { ProfileService } from "./../../profile.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"]
})
export class WelcomeComponent implements OnInit {
  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.update("showSave", false);
  }
}
