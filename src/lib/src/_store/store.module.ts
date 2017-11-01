import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import * as fromRoot from './index.reducers';
import {DashboardEffects} from './dashboard.effects';
import {MnohubDatastore} from '../_jsonapi-services/mnohub-datastore';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    StoreModule.forRoot(fromRoot.reducers),
    EffectsModule.forRoot([DashboardEffects]),
  ],
  providers: [
    MnohubDatastore
  ]
})
export class ImpacMaterialModule {
}
