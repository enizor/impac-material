import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DashboardService {

  constructor() { }

  // Observable string sources
  public widgetSource = new Subject<Object>();

  // Observable string streams
  public widgetRedrew$ = this.widgetSource.asObservable();

  // Send a message command to all the widget to redraw themselves
  public redrawWidget(widget: Object) {
    this.widgetSource.next(widget);
  }

}
