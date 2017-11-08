import { JsonApiModelConfig } from '../_ngrx-jsonapi/decorators/json-api-model-config.decorator';
import { JsonApiModel } from '../_ngrx-jsonapi/models/json-api.model';
import { Attribute } from '../_ngrx-jsonapi/decorators/attribute.decorator';

@JsonApiModelConfig({
  type: 'widgets'
})
export class Widget extends JsonApiModel {

  @Attribute()
  name: string;

}
