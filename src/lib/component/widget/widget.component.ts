import { Component, Input } from '@angular/core';
import { Widget } from "./widget";

@Component({
  selector: 'impac-widget',
  templateUrl: './widget.component.html',
  styleUrls: [ './widget.component.scss' ]
})
export class WidgetComponent {
  @Input() widget: Widget;

  close (event) {
    event.stopPropagation()
    console.log('### DEBUG widget click event');
  }
}
