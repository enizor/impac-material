import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { GridsterModule } from 'angular-gridster2/dist/index';

import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { DashboardService } from './_service/dashboard.service';
import { appInjector } from './_helpers/app-injector';
import * as fromRoot from './index.reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(fromRoot.reducers),
    GridsterModule
  ],
  declarations: [ ContainerComponent, DashboardComponent, WidgetComponent ],
  providers: [
    DashboardService
  ],
  exports: [ ContainerComponent, DashboardComponent ]
})
export class ImpacMaterialModule {
  constructor(private injector: Injector) {
    appInjector(this.injector);
  }
}
