import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridsterModule } from 'angular-gridster2';

import { DashboardComponent } from './component/dashboard.component';
import { WidgetComponent } from './component/widget/widget.component';
import { LibService } from './service/lib.service';

@NgModule({
  imports: [ CommonModule, GridsterModule ],
  declarations: [ DashboardComponent, WidgetComponent ],
  providers: [ LibService ],
  exports: [ DashboardComponent ]
})
export class ImpacMaterialModule { }
