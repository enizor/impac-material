import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { DashboardService } from './_service/dashboard.service';
import { appInjector } from './_helpers/app-injector';

@NgModule({
  imports: [
    CommonModule,
    GridsterModule
  ],
  declarations: [ DashboardComponent, WidgetComponent ],
  providers: [
    DashboardService
  ],
  exports: [ DashboardComponent ]
})
export class ImpacMaterialModule {
  constructor(private injector: Injector) {
    appInjector(this.injector);
  }
}
