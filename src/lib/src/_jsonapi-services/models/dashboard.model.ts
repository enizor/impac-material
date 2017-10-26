import { Attribute, JsonApiModelConfig } from 'angular2-jsonapi';
import { BaseModel } from './base.model';

export interface IDashboard {
  name: string;
  active?: boolean;
}

@JsonApiModelConfig({
  type: 'dashboards'
})
export class Dashboard extends BaseModel implements IDashboard {

  @Attribute()
  name: string;

  @Attribute()
  active?: boolean;

}
