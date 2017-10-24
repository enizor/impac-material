import { AfterContentInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { DashboardService } from '../_service/dashboard.service';
import { Subscription } from 'rxjs/Subscription';

import Highcharts from 'highcharts/highcharts.js';

@Component({
  selector: 'impac-widget',
  templateUrl: './widget.component.html',
  styleUrls: [ './widget.component.scss' ]
})
export class WidgetComponent implements AfterContentInit, OnDestroy {
  @Input() widget: any;
  @ViewChild('chartTarget') chartTarget: ElementRef;

  widgetSubscription: Subscription;

  chart: Highcharts.ChartObject;
  options: Highcharts.Options;

  constructor(public dashboardService: DashboardService) {}

  ngAfterContentInit() {
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

    this.chart = new Highcharts.Chart(this.chartTarget.nativeElement, this.options, () => {
      // Redraw the chart when a widget is reloaded
      this.widgetSubscription = this.dashboardService.widgetRedrew$.subscribe(
        widget => {
          // Redraw the widget only if this widget is the one that has been redrawn
          // 300ms is the time the gridster-item adopt its final width/height
          if (widget === this.widget) { setTimeout(() => { this.chart.reflow(); }, 300); }
        }
      );

      setInterval(() => {
        this.chart.series[0].addPoint(Math.random() * 100);
      }, 2000);
    });
  }

  public close (event) {
    event.stopPropagation();
    console.log('### DEBUG widget click event');
  }

  ngOnDestroy() {
    this.widgetSubscription.unsubscribe();
    this.chart.destroy();
  }
}
