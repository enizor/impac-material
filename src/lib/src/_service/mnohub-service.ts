import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonapiService } from '../_ngrx-jsonapi/services/jsonapi-service';
import { JsonApiServiceConfig } from '../_ngrx-jsonapi/decorators/json-api-service-config.decorator';
import { Dashboard } from '../_models/dashboard.model';
import { Widget } from '../_models/widget.model';
import { DatastoreConfig } from 'angular2-jsonapi';

const config: DatastoreConfig = {
  baseUrl: '/api/mnoe/v2',
  models: {
    dashboards: Dashboard,
    widgets: Widget
  }
};

@Injectable()
@JsonApiServiceConfig(config)
export class MnohubService extends JsonapiService {

  constructor(http: HttpClient) {
    super(http);
  }

}
