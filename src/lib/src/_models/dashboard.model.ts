import { JsonApiModelConfig } from '../_ngrx-jsonapi/decorators/json-api-model-config.decorator';
import { JsonApiModel } from '../_ngrx-jsonapi/models/json-api.model';
import { Attribute } from '../_ngrx-jsonapi/decorators/attribute.decorator';
import { HasMany } from '../_ngrx-jsonapi/decorators/has-many.decorator';
import { Widget } from './widget.model';

@JsonApiModelConfig({
  type: 'dashboards'
})
export class Dashboard extends JsonApiModel {

  @Attribute()
  name: string;

  active?: boolean;

  @HasMany()
  widgets: Widget[];

  @Attribute('created_at')
  createdAt?: Date;

  @Attribute('updated_at')
  updatedAt?: Date;

  // widgets_order?: any;
  // currency?: string;
  // dashboard_type?: string;
  // hist_parameters?: any;
  // organization_ids?: Array<string>;
  // owner_id?: Number;
  // owner_type?: string;
  // published?: boolean;
  // settings?: any;
  // source_id?: any;

}
