import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';

import { DashboardService } from '../_service/dashboard.service';
import { appInjector } from '../_helpers/app-injector';

@Component({
  selector: 'impac-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  options: GridsterConfig;
  widgets: Array<Object>;

  constructor(public dashboardService: DashboardService) {}

  static eventStop(item: any, scope: any) {
    // console.info('eventStop', item, scope);
  }

  static itemInit(item: any) {
    // console.info('itemInitialized', item);
  }

  static itemChange(item: any, scope: any) {
    // console.info('itemChanged', item, scope);
  }

  ngOnInit() {
    console.info('### ngOnInit this.dashboardService', this.dashboardService);

    this.options = {
      gridType: 'verticalFixed',
      swap: true,
      pushItems: true, // push items when resizing and dragging
      pushResizeItems: true, // on resize of item will shrink adjacent items
      compactType: 'none',
      itemChangeCallback: DashboardComponent.itemChange,
      itemResizeCallback: this.itemResize,
      outerMargin: true,
      margin: 10,
      maxCols: 24,
      maxItemCols: 4,
      minItemCols: 1,
      maxItemRows: 4,
      minItemRows: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 250,
      fixedRowHeight: 250,
      draggable: {
        enabled: true,
        stop: DashboardComponent.eventStop
      },
      resizable: {
        enabled: true,
        stop: DashboardComponent.eventStop
      }
    };

    this.widgets = [
      {cols: 2, rows: 1, y: 0, x: 0, title: 'Cashflow Balance', initCallback: DashboardComponent.itemInit},
      {cols: 2, rows: 2, y: 0, x: 2, title: 'Payable / Receivable',  initCallback: DashboardComponent.itemInit}
    ];
  }

  itemResize(item: any, scope: any) {
    const dashboardService = appInjector().get(DashboardService);
    dashboardService.redrawWidget(item);
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item: any) {
    this.widgets.splice(this.widgets.indexOf(item), 1);
  }

  addItem() {
    this.widgets.push({});
  }
}
