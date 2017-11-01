import { JsonApiModelConfig } from '../_ngrx-jsonapi/decorators/json-api-model-config';
import { JsonApiModel } from '../_ngrx-jsonapi/models/json-api.model';
import { Attribute } from '../_ngrx-jsonapi/decorators/attribute.decorator';

@JsonApiModelConfig({
  type: 'dashboards'
})
export class Dashboard extends JsonApiModel {

  @Attribute()
  name: string;

  @Attribute()
  created_at: Date;

  @Attribute()
  updated_at: Date;

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
