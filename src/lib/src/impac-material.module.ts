import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';
import { GridsterModule } from 'angular-gridster2/dist/index';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { environment } from '../../environments/environment';
import { appInjector } from './_helpers/app-injector';
import { ContainerComponent } from './container/container.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { DashboardService } from './_service/dashboard.service';
import * as fromRoot from './_store/index.reducers';
import { EffectsModule } from '@ngrx/effects';
import { DashboardEffects } from './_store/dashboard.effects';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BasicAuthInterceptor } from './_interceptors/basic-auth-interceptor';
import { JsonapiService } from './_ngrx-jsonapi/services/jsonapi-service';

const optionalImports = [];
if (!environment.production) {
  // Note that you must instrument after importing StoreModule
  optionalImports.push(StoreDevtoolsModule.instrument(<StoreDevtoolsOptions>{maxAge: 25}));
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    HttpClientModule,
    StoreModule.forRoot(fromRoot.reducers),
    EffectsModule.forRoot([DashboardEffects]),
    GridsterModule,
    TabsModule.forRoot(),
    ...optionalImports
  ],
  declarations: [ ContainerComponent, DashboardComponent, WidgetComponent ],
  providers: [
    JsonapiService,
    DashboardService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
  ],
  exports: [ ContainerComponent, DashboardComponent ]
})
export class ImpacMaterialModule {
  constructor(private injector: Injector) {
    appInjector(this.injector);
  }
}
