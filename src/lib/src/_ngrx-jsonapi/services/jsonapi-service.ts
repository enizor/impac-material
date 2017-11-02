import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qs from 'qs';
import { Observable } from 'rxjs/Observable';
import { ModelConfig} from '../interfaces/model-config.interface';
import { JsonApiModel } from '../models/json-api.model';
import { JsonApiQueryData } from '../models/json-api-query-data';

@Injectable()
export class JsonapiService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = '/api/mnoe/v2';
  }

  /**
   * Find all the records from the API
   * @param modelType Model type to fetch
   * @param params (optional) Hash of additional parameters
   * @returns observable of fetched models
   */
  public findAll<T extends JsonApiModel>(modelType: T, params?: any): Observable<T[]> {
    const url: string = this.buildUrl(modelType, params);
    return this.http.get(url).map((res: any) => this.extractQueryData(res, modelType));
  }

  /**
   * Delete a record from the API
   * @param modelType Model type to delete
   * @param id Id of the record to delete
   * @returns observable of fetched models
   */
  deleteRecord<T extends JsonApiModel>(modelType: T, id: string): Observable<Response> {
    let url: string = this.buildUrl(modelType, null, id);
    return this.http.delete(url);
  }

  private buildUrl<T extends JsonApiModel>(model: T, params?: any, id?: string): string {
    const queryParams: string = this.toQueryString(params);
    const modelConfig: ModelConfig = Reflect.getMetadata('JsonApiModelConfig', model);
    const url: string = [this.baseUrl, modelConfig.type, id].join('/');

    return queryParams ? `${url}?${queryParams}` : url;
  }

  private toQueryString(params: any) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }

  private extractQueryData<T extends JsonApiModel>(res: any, modelType: T, withMeta = false): T[] | JsonApiQueryData<T> {
    const models: T[] = [];

    res.data.forEach((data: any) => {
      const model: T = this.deserializeModel(modelType, data);

      if (res.included) {
        model.syncRelationships(data, res.included, 0);
      }

      models.push(model);
    });

    if (withMeta && withMeta === true) {
      return new JsonApiQueryData(models, this.parseMeta(res, modelType));
    } else {
      return models;
    }
  }

  protected parseMeta(body: any, modelType: JsonApiModel): any {
    const metaModel: any = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
    const jsonApiMeta = new metaModel();

    for (const key in body) {
      if (jsonApiMeta.hasOwnProperty(key)) {
        jsonApiMeta[key] = body[key];
      }
    }
    return jsonApiMeta;
  }

  private deserializeModel<T extends JsonApiModel>(modelType: T, data: any) {
    data.attributes = this.transformSerializedNamesToPropertyNames(modelType, data.attributes);
    return new modelType(data);
  }

  private transformSerializedNamesToPropertyNames<T>(modelType: T, attributes: any) {
    const serializedNameToPropertyName = this.getModelPropertyNames(modelType.prototype);
    const properties: any = {};
    Object.keys(serializedNameToPropertyName).forEach(serializedName => {
      if (attributes[serializedName]) {
        properties[serializedNameToPropertyName[serializedName]] = attributes[serializedName];
      }
    });
    return properties;
  }

  private getModelPropertyNames(model: JsonApiModel) {
    return Reflect.getMetadata('AttributeMapping', model);
  }

}
