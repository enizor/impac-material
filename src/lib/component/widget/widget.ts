
export class Widget {
  id: number;
  name: string;
  kpis: Object[];
  owner: string;
  settings: {};
  widget_category: string;
  width: number;
  content: {};

  constructor(parameters: { widget: any }) {
    let widget = parameters.widget;
    console.log('widget constructor: ', widget);
  }
}
