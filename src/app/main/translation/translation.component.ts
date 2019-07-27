import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-translation",
  templateUrl: "./translation.component.html",
  styleUrls: ["./translation.component.scss"]
})
export class TranslationComponent{

	constructor(
              private translate: TranslateService) {	  	
  	}

  	update(langCode){
  		this.translate.use(langCode);
  	}
}
