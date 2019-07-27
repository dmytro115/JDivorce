import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core';

@Component({
  selector: 'app-lawyer-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
      './dashboard.component.scss'
  ]
})
export class DashboardComponent implements OnInit{

 	constructor(
		private authService: AuthService){

	}

	ngOnInit(){
		this.authService.clearViewClientDetails();
	}
}
