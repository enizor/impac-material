import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';

@Component({
  selector: 'impac-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  name = 'Impac!';

  widgets: Array<Object>;
  options: GridsterConfig;
  dashboard: Array<Object>;

  static eventStop(item: any, scope: any) {
    console.info('eventStop', item, scope);
  }

  static itemChange(item: any, scope: any) {
    console.info('itemChanged', item, scope);
  }

  static itemResize(item: any, scope: any) {
    console.info('itemResized', item, scope);
  }

  static itemInit(item: any) {
    console.info('itemInitialized', item);
  }

  ngOnInit() {
    this.widgets = [
      { name: 'Cashflow Projection' },
      { name: 'Account Blance' }
    ];

    this.options = {
      gridType: 'verticalFixed',
      swap: true,
      pushItems: true, // push items when resizing and dragging
      pushResizeItems: true, // on resize of item will shrink adjacent items
      compactType: 'none',
      itemChangeCallback: DashboardComponent.itemChange,
      itemResizeCallback: DashboardComponent.itemResize,
      outerMargin: true,
      margin: 10,
      maxCols: 6,
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

    this.dashboard = [
      {cols: 2, rows: 1, y: 0, x: 0, title: 'Cashflow Balance'},
      {cols: 2, rows: 2, y: 0, x: 2},
      {cols: 1, rows: 1, y: 0, x: 4},
      {cols: 1, rows: 1, y: 0, x: 5},
      {cols: undefined, rows: undefined, y: 1, x: 0},
      {cols: 1, rows: 1, y: undefined, x: undefined},
      {cols: 2, rows: 2, y: 1, x: 5, minItemRows: 2, minItemCols: 2, title: 'Min rows & cols = 2'},
      {cols: 2, rows: 2, y: 2, x: 0, maxItemRows: 2, maxItemCols: 2, title: 'Max rows & cols = 2'},
      {cols: 2, rows: 1, y: 2, x: 2, dragEnabled: true, resizeEnabled: true, title: 'Drag&Resize Enabled'},
      {cols: 1, rows: 1, y: 2, x: 4, dragEnabled: false, resizeEnabled: false, title: 'Drag&Resize Disabled'},
      {cols: 1, rows: 1, y: 0, x: 6, initCallback: DashboardComponent.itemInit}
    ];
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  removeItem(item: any) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  };

  addItem() {
    this.dashboard.push({});
  };
}
