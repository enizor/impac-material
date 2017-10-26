import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { DatastoreConfig, JsonApiDatastore, JsonApiDatastoreConfig } from 'angular2-jsonapi';
// import { User } from './models/user.model';
// import { Organization } from './models/organization.model';
import { Dashboard } from './models/dashboard.model';

const config: DatastoreConfig = {
  baseUrl: '/api/mnoe/v2',
  models: {
    // organizations: Organization,
    // users: User
    dashboards: Dashboard
  }
};

@Injectable()
@JsonApiDatastoreConfig(config)
export class MnohubDatastore extends JsonApiDatastore {

  // TODO: migrate to angular2-jsonapi using HttpClient when ready
  constructor(http: Http) {
    const headers = new Headers();
    const auth = 'Basic ' + btoa('ea461720-b044-0132-dba6-600308937d74' + ':' + 'dPhCSjZCJ68I2cQLzCBtTg');
    headers.append('Authorization', auth);
    super(http);
    this.headers = headers;
  }

}
