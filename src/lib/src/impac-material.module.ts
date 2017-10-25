import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';
import { GridsterModule } from 'angular-gridster2/dist/index';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { DashboardService } from './_service/dashboard.service';
import { appInjector } from './_helpers/app-injector';
import * as fromRoot from './_store/index.reducers';
import { environment } from '../../environments/environment';

const optionalImports = [];
if (!environment.production) {
  // Note that you must instrument after importing StoreModule
  optionalImports.push(StoreDevtoolsModule.instrument({maxAge: 5}));
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(fromRoot.reducers),
    GridsterModule,
    TabsModule.forRoot(),
    ...optionalImports
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
