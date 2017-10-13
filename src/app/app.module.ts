import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ImpacMaterialModule } from '../../index';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImpacMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
