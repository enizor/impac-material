import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule, StoreDevtoolsOptions } from '@ngrx/store-devtools';
import { GridsterModule } from 'angular-gridster2/dist/index';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { environment } from '../../environments/environment';
import { appInjector } from './_helpers/app-injector';
import { DashboardSelectorComponent } from './dashboard-selector/dashboard-selector.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WidgetComponent } from './widget/widget.component';
import { DashboardEventsService } from './_service/dashboard-events.service';
import * as fromRoot from './_store/index.reducers';
import { DashboardEffects } from './_store/dashboard.effects';
import { BasicAuthInterceptor } from './_interceptors/basic-auth-interceptor';
import { JsonapiService } from './_ngrx-jsonapi/services/jsonapi-service';
import { MnohubService } from './_service/mnohub-service';

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
  declarations: [ DashboardSelectorComponent, DashboardComponent, WidgetComponent ],
  providers: [
    JsonapiService,
    MnohubService,
    DashboardEventsService,
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
  ],
  exports: [ DashboardSelectorComponent, DashboardComponent ]
})
export class ImpacMaterialModule {
  constructor(private injector: Injector) {
    appInjector(this.injector);
  }
}
