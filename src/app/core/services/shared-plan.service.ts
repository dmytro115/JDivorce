import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedPlanService {
  public selectedPlanId: number;

  constructor() {}

  setPlanId(id: number) {
    this.selectedPlanId = id;
  }
}
