import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import * as highcharts from 'highcharts';

export function highchartsFactory() {
  return highcharts;
}

import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { LibService } from './_service/lib.service';
import { DashboardService } from './_service/dashboard.service';
import { appInjector } from './_helpers/app-injector';

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
