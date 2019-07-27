import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { BillingOrdersService } from './orders.service';
import { AuthService } from "../../core/auth/auth.service";
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class BillingOrdersComponent implements OnInit {
  orders: any = [];
  isClient: boolean;
  isAdminClient: boolean = false;
  orderCount: number;
  currentPageNum: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private billingOrdersService: BillingOrdersService,
    private authService: AuthService,
    private router: Router) {}

  ngOnInit() {
    if (this.authService.isClient()) {
      this.authService.isAdminClient().subscribe((response: boolean) => {
        this.isAdminClient = response;
      });
    }

    this.getOrderStates(this.currentPageNum);
  }

  changeDateFormat(date) {
    return dayjs(date).format('YYYY-MM-DD hh:mm A');
  }

  ConvertString(value){
    return parseFloat(value).toFixed(2);
  }

  getOrderStates(pageNum) {
    this.billingOrdersService.getOrderStates(pageNum).subscribe((data: any) => {
      this.isClient = this.authService.isClient();
      this.orders = data.response;
      this.orderCount = data.meta.total_count;
      this.currentPageNum = data.meta.current_page;
      this.itemsPerPage = data.meta.limit_value;
    });
  }

  getPage(page: number) {
    this.getOrderStates(page);
  }
}
