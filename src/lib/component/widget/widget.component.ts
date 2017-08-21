import { Component, Input } from '@angular/core';
import { Widget } from './widget';

@Component({
  selector: 'impac-widget',
  templateUrl: './widget.component.html',
  styleUrls: [ './widget.component.scss' ]
})
export class WidgetComponent {
  @Input() widget: Widget;
  options: Object;

  constructor() {
    this.options = {
      title : { text : 'simple chart' },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2],
      }]
    };
  }

  close (event) {
    event.stopPropagation();
    console.log('### DEBUG widget click event');
  }
}
