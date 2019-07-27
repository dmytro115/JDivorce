import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class DashboardSharedService {
  urlFragment: string;
  workflowType: string;
}
