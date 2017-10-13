import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);

  return hc;
}

import { DashboardComponent } from './component/dashboard.component';
import { WidgetComponent } from './component/widget/widget.component';
import { LibService } from './service/lib.service';
import { DashboardService } from './service/dashboard.service';
import { appInjector } from './helpers/app-injector';

@NgModule({
  imports: [
    CommonModule,
    GridsterModule,
    ChartModule
  ],
  declarations: [ DashboardComponent, WidgetComponent ],
  providers: [
    LibService,
    DashboardService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    }
  ],
  exports: [ DashboardComponent ]
})
export class ImpacMaterialModule {
  constructor(private injector: Injector) {
    appInjector(this.injector);
  }
}
