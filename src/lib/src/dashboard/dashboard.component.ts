import 'rxjs/add/operator/find';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GridsterConfig } from 'angular-gridster2';
import { Store } from '@ngrx/store';

import { DashboardService } from '../_service/dashboard.service';
import { appInjector } from '../_helpers/app-injector';
import * as fromRoot from '../_store/index.reducers';
import { Observable } from 'rxjs/Observable';
import { Dashboard } from '../_models/dashboard.model';

@Component({
  selector: 'impac-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  dashboard$: Observable<Dashboard>;

  options: GridsterConfig;

  constructor(private store: Store<fromRoot.State>) {}

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
    this.dashboard$ = this.store.select('dashboards').map((dashboards) =>
      dashboards.find((d) => d.active)
    );

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
      minCols: 8,
      maxCols: 8,
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
