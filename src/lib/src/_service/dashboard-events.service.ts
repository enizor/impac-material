import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardEventsService {

  constructor() { }

  // Observable string sources
  public widgetSource = new Subject<Object>();

  // Observable string streams
  public widgetRedrew$: Observable<Object> = this.widgetSource.asObservable();

  // Send a message command to all the widget to redraw themselves
  public redrawWidget(widget: Object) {
    this.widgetSource.next(widget);
  }

}
