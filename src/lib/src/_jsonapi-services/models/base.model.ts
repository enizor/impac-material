import { Headers } from '@angular/http';
import { Attribute, JsonApiModel } from 'angular2-jsonapi';
import { MnohubDatastore } from '../mnohub-datastore';
import { appInjector } from '../../_helpers/app-injector';

export class BaseModel extends JsonApiModel {

  @Attribute('created_at')
  createdAt: Date;

  @Attribute('updated_at')
  updatedAt: Date;

  public static new(data?: any, params?: any, headers?: Headers) {
    const datastore = appInjector().get(MnohubDatastore);
    const dashboard = datastore.createRecord(this, data);
    return dashboard.save(params, headers);
  }

  public static all(params?: any, headers?: Headers, customUrl?: string) {
    const datastore = appInjector().get(MnohubDatastore);
    return datastore.findAll(this, params, headers, customUrl);
  }

  public static find(id: string, params?: any, headers?: Headers, customUrl?: string) {
    const datastore = appInjector().get(MnohubDatastore);
    return datastore.findRecord(this, id, params, headers, customUrl);
  }

}
