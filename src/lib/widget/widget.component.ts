import { Component, Input, OnDestroy } from '@angular/core';
import { ChartEvent } from 'angular2-highcharts/dist/ChartEvent';
import { ChartObject } from 'highcharts';
import { DashboardService } from '../_service/dashboard.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'impac-widget',
  templateUrl: './widget.component.html',
  styleUrls: [ './widget.component.scss' ]
})
export class WidgetComponent implements OnDestroy {
  @Input() widget: Object;

  widgetSubscription: Subscription;

  chart: ChartObject;
  options: Object;

  constructor(public dashboardService: DashboardService) {
    // Redraw the chart when a widget is reloaded
    this.widgetSubscription = this.dashboardService.widgetRedrew$.subscribe(
      widget => {
        // Redraw the widget only if this widget is the one that has been redrawn
        // 300ms is the time the gridster-item adopt its final width/height
        if (widget === this.widget) { setTimeout(() => { this.chart.reflow(); }, 300); }
      }
    );

    this.options = {
      title : { text : 'simple chart' },
      chart: { type: 'spline' },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2],
      }],
      credits: {
        enabled: false
      }
    };
    setInterval(() => {
      this.chart.series[0].addPoint(Math.random() * 100);
    }, 2000);
  }

  protected onChartLoad(event: ChartEvent) {
    this.chart = event.context;
    setTimeout(() => { this.chart.reflow(); }, 20);
  }

  protected close (event) {
    event.stopPropagation();
    console.log('### DEBUG widget click event');
  }

  ngOnDestroy() {
    this.widgetSubscription.unsubscribe();
  }
}
