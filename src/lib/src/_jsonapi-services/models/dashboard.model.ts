import { Attribute, JsonApiModelConfig } from 'angular2-jsonapi';
import { BaseModel } from './base.model';

@JsonApiModelConfig({
  type: 'dashboards'
})
export class Dashboard extends BaseModel {

  @Attribute()
  name: string;

  @Attribute()
  active?: boolean;

}
