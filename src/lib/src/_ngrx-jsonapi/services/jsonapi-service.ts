import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as qs from 'qs';
import find from 'lodash-es/find';
import { ModelConfig} from '../interfaces/model-config.interface';
import { JsonApiModel } from '../models/json-api.model';
import { JsonApiQueryData } from '../models/json-api-query-data';
import { ErrorResponse } from '../models/error-response.model';

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
  public findAll<T extends JsonApiModel>(model: T, params?: any): Observable<T[]> {
    const url: string = this.buildUrl(model, params);
    return this.http.get(url)
      .map((res: any) => this.extractQueryData(res, model))
      .catch(error => this.handleError(error));
  }

  /**
   * Save a record in the API
   * @param model Model type to delete
   * @param params (optional) Hash of additional parameters
   * @returns observable of saved record
   */
  public saveRecord<T extends JsonApiModel>(model: T, params?: any): Observable<T> {
    let attributesMetadata: any = Reflect.getMetadata('Attribute', model);
    const modelConfig: ModelConfig = model.modelConfig;
    let typeName: string = modelConfig.type;
    let relationships: any = this.getRelationships(model);
    let url: string = this.buildUrl(model, params, model.id);
    let httpCall: Observable<Response>;

    let body: any = {
      data: {
        id: model.id,
        type: typeName,
        attributes: this.getDirtyAttributes(attributesMetadata),
        relationships: relationships
      }
    };

    if (model.id) {
      httpCall = this.http.patch(url, body);
    } else {
      httpCall = this.http.post(url, body);
    }

    return httpCall
      .map(res => res.status === 201 ? this.extractRecordData(res, model) : model)
      .map(res => this.resetMetadataAttributes(res, attributesMetadata))
      // .map(res => this.updateRelationships(res, relationships));
      .catch(error => this.handleError(error));
  }

  /**
   * Delete a record from the API
   * @param model Model type to delete
   * @param id Id of the record to delete
   * @returns observable of fetched models
   */
  deleteRecord<T extends JsonApiModel>(model: T, id: string): Observable<Response> {
    let url: string = this.buildUrl(model, null, id);
    return this.http.delete(url).catch(error => this.handleError(error));
  }

  protected handleError(error: any): ErrorObservable {
    let errMsg: string = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';

    if (error.error && error.error.errors && error.error.errors instanceof Array) {
      let errors: ErrorResponse = new ErrorResponse(error.error.errors);
      console.error(errMsg, errors);
      return Observable.throw(errors);
    }

    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  private buildUrl<T extends JsonApiModel>(model: T, params?: any, id?: string): string {
    const queryParams: string = this.toQueryString(params);
    const modelConfig: ModelConfig = model.modelConfig || Reflect.getMetadata('JsonApiModelConfig', model);
    const url: string = [this.baseUrl, modelConfig.type, id].filter(x => x).join('/');

    return queryParams ? `${url}?${queryParams}` : url;
  }

  private toQueryString(params: any) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }

  private extractQueryData<T extends JsonApiModel>(res: any, model: T, withMeta = false): T[] | JsonApiQueryData<T> {
    const models: T[] = [];

    res.data.forEach((data: any) => {
      const m: T = this.deserializeModel(model, data);

      if (res.included) {
        m.syncRelationships(data, res.included, 0);
      }

      models.push(m);
    });

    if (withMeta && withMeta === true) {
      return new JsonApiQueryData(models, this.parseMeta(res, model));
    } else {
      return models;
    }
  }

  protected parseMeta(body: any, model: JsonApiModel): any {
    const metaModel: any = Reflect.getMetadata('JsonApiModelConfig', model).meta;
    const jsonApiMeta = new metaModel();

    for (const key in body) {
      if (jsonApiMeta.hasOwnProperty(key)) {
        jsonApiMeta[key] = body[key];
      }
    }
    return jsonApiMeta;
  }

  private deserializeModel<T extends JsonApiModel>(model: T, data: any) {
    data.attributes = this.transformSerializedNamesToPropertyNames(model, data.attributes);
    return new model(data);
  }

  private getRelationships(data: any): any {
    let relationships: any;
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] instanceof JsonApiModel) {
          relationships = relationships || {};
          relationships[key] = {
            data: this.buildSingleRelationshipData(data[key])
          };
        } else if (data[key] instanceof Array && data[key].length > 0 && this.isValidToManyRelation(data[key])) {
          relationships = relationships || {};
          relationships[key] = {
            data: data[key].map((model: JsonApiModel) => this.buildSingleRelationshipData(model))
          };
        }
      }
    }
    return relationships;
  }

  private buildSingleRelationshipData(model: JsonApiModel): any {
    let relationshipType: string = model.modelConfig.type;
    let relationShipData: { type: string, id?: string, attributes?: any } = {type: relationshipType};
    if (model.id) {
      relationShipData.id = model.id;
    } else {
      let attributesMetadata: any = Reflect.getMetadata('Attribute', model);
      relationShipData.attributes = this.getDirtyAttributes(attributesMetadata);
    }
    return relationShipData;
  }

  private isValidToManyRelation(objects: Array<any>): boolean {
    let isJsonApiModel = objects.every(item => item instanceof JsonApiModel);
    let relationshipType: string = isJsonApiModel ? objects[0].modelConfig.type : '';
    return isJsonApiModel ? objects.every((item: JsonApiModel) => item.modelConfig.type === relationshipType) : false;
  }

  private getDirtyAttributes(attributesMetadata: any): { string: any} {
    let dirtyData: any = {};
    for (let propertyName in attributesMetadata) {
      if (attributesMetadata.hasOwnProperty(propertyName)) {
        let metadata: any = attributesMetadata[propertyName];
        if (metadata.hasDirtyAttributes) {
          let attributeName = metadata.serializedName != null ? metadata.serializedName : propertyName;
          dirtyData[attributeName] = metadata.serialisationValue ? metadata.serialisationValue : metadata.newValue;
        }
      }
    }
    return dirtyData;
  }

  private extractRecordData<T extends JsonApiModel>(res: any, model?: T): T {
    if (!res) {
      throw new Error('no body in response');
    }

    if (model) {
      model.id = res.data.id;
      Object.assign(model, res.data.attributes);
    }

    model = this.deserializeModel(model, res.data);

    if (res.included) {
      model.syncRelationships(res.data, res.included, 0);
    }
    return model;
  }

  private resetMetadataAttributes<T extends JsonApiModel>(res: T, attributesMetadata: any) {
    attributesMetadata = Reflect.getMetadata('Attribute', res);
    for (let propertyName in attributesMetadata) {
      if (attributesMetadata.hasOwnProperty(propertyName)) {
        let metadata: any = attributesMetadata[propertyName];
        if (metadata.hasDirtyAttributes) {
          metadata.hasDirtyAttributes = false;
        }
      }
    }
    Reflect.defineMetadata('Attribute', attributesMetadata, res);
    return res;
  }

  private updateRelationships(model: JsonApiModel, relationships: any): JsonApiModel {
    let modelsTypes: any = Reflect.getMetadata('JsonApiDatastoreConfig', this.constructor).models;
    for (let relationship in relationships) {
      if (relationships.hasOwnProperty(relationship) && model.hasOwnProperty(relationship)) {
        let relationshipModel: JsonApiModel = model[relationship];
        let hasMany: any[] = Reflect.getMetadata('HasMany', relationshipModel);
        let propertyHasMany: any = find(hasMany, (property) => {
          return modelsTypes[property.relationship] === model.constructor;
        });
        if (propertyHasMany) {
          if (relationshipModel[propertyHasMany.propertyName] !== undefined) {
            relationshipModel[propertyHasMany.propertyName].push(model);
          }
        }
      }
    }
    return model;
  };

  private transformSerializedNamesToPropertyNames<T>(model: T, attributes: any) {
    const serializedNameToPropertyName = this.getModelPropertyNames(model.prototype);
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
