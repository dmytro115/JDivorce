import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkflowType } from '../../core/models/workflow-type.model';
import { TimelineService } from '../../core/timeline/timeline.service';
import { TimelineStep } from './timeline-step.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss', '../../../assets/neuethemes/samuel/assets/custom/2.2.0/css/colors/default.css']
})
export class TimelineComponent implements OnInit {
  timelineSteps: Array<TimelineStep>;
  viewMore: Array<boolean>;
  isSummaryChecked = false;
  chartData: any = [];

  constructor(private readonly timelineService: TimelineService, private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.getTimelineSteps();
  }

  getChartData() {
    let previous_date;
    let current_date;
    let timeDiff = 0;
    const chartData = [];
    const owners = [];
    const ownersClasses = ['owner-blue', 'owner-red', 'owner-green'];
    const ownersDateClasses = ['timeline-date-owner-blue', 'timeline-date-owner-red', 'timeline-date-owner-green'];

    for (let i = 1; i < this.timelineSteps.length; i++) {
      if (
        !owners.some(r => {
          return r.owner === this.timelineSteps[i].owner;
        })
      ) {
        owners.push({ owner: this.timelineSteps[i].owner, class: ownersClasses[owners.length], dateClass: ownersDateClasses[owners.length] });
      }
    }

    for (let i = 1; i < this.timelineSteps.length; i++) {
      previous_date = Date.parse(this.timelineSteps[i - 1]['date']);
      current_date = Date.parse(this.timelineSteps[i]['date']);
      timeDiff = current_date - previous_date;
      chartData.push({
        title: this.timelineSteps[i]['stepTitle'],
        date: this.timelineSteps[i]['date'],
        duration: (Math.ceil(timeDiff / (1000 * 3600 * 24)) % 10) * 40 + 'px',
        chartColorClass: 'ui-menu-color0' + ((i % 6) + 1),
        dateColorClass: owners.filter(obj => {
          if (obj.owner === this.timelineSteps[i].owner) {
            return obj;
          }
        })[0].dateClass,
        blockColorClass: owners.filter(obj => {
          if (obj.owner === this.timelineSteps[i].owner) {
            return obj;
          }
        })[0].class
      });
    }

    return chartData;
  }

  ToggleTimeLine(event) {
    this.isSummaryChecked = event.target.checked;
  }

  owner(owner: string): string {
    if (owner === 'You') {
      return 'You are responsible for this step.';
    } else {
      return owner;
    }
  }

  showCost(cost: string): boolean {
    return cost !== '0.00';
  }

  cost(cost: string): string {
    if (this.showCost(cost)) {
      return cost;
    } else {
      return 'Free';
    }
  }

  private getTimelineSteps(): void {
    this.route.params.subscribe(params => {
      const workflowUrlFragment = params['workflowUrlFragment'];
      if (workflowUrlFragment) {
        this.timelineService.show(WorkflowType.fromFragment(workflowUrlFragment)).subscribe(
          (timelineSteps: Array<TimelineStep>) => {
            this.timelineSteps = timelineSteps;
            this.viewMore = new Array(this.timelineSteps.length).fill(true);
            this.chartData = this.getChartData();
          },
          err => console.log(err),
          () => {}
        );
      }
    });
  }

  private toggleViewMore(i: number): void {
    $('#colapse-' + i).slideToggle();
  }
}
