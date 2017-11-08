import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as qs from 'qs';
import find from 'lodash-es/find';
import { ModelConfig} from '../interfaces/model-config.interface';
import { JsonApiModel } from '../models/json-api.model';
import { JsonApiQueryData } from '../models/json-api-query-data';
import { ErrorResponse } from '../models/error-response.model';

export interface ModelType<T extends JsonApiModel> { new(data: any): T; }

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
  public findAll<T extends JsonApiModel>(modelType: ModelType<T>, params?: any): Observable<T[]> {
    const url: string = this.buildUrl(modelType, params);
    return this.http.get(url)
      .map((res: any) => this.extractQueryData(res, modelType))
      .catch(error => this.handleError(error));
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

  /**
   * Save a record in the API
   * @param model Model type to delete
   * @param params (optional) Hash of additional parameters
   * @returns observable of saved record
   */
  public saveRecord<T extends JsonApiModel>(model: T, params?: any): Observable<T> {
    let attributesMetadata: any = Reflect.getMetadata('Attribute', model);
    let modelType = <ModelType<T>>model.constructor;
    const modelConfig: ModelConfig = model.modelConfig;
    let typeName: string = modelConfig.type;
    let relationships: any = this.getRelationships(model);
    let url: string = this.buildUrl(modelType, params, model.id);

    let httpCall: Observable<Object>;
    let body: any = {
      data: {
        id: model.id,
        type: typeName,
        attributes: this.getDirtyAttributes(attributesMetadata),
        relationships: relationships
      }
    };

    if (model.id) {
      httpCall = this.http.patch(url, body, {observe: 'response'});
    } else {
      httpCall = this.http.post(url, body, {observe: 'response'});
    }

    return httpCall
      .map(res => (res.status === 201 ? this.extractRecordData(res, modelType, model) : model))
      .catch(error => {
        console.error(error);
        return Observable.of(model);
      })
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

  private buildUrl<T extends JsonApiModel>(modelType: ModelType<T>, params?: any, id?: string): string {
    const queryParams: string = this.toQueryString(params);
    const modelConfig: ModelConfig = Reflect.getMetadata('JsonApiModelConfig', modelType);
    const url: string = [this.baseUrl, modelConfig.type, id].filter(x => x).join('/');

    return queryParams ? `${url}?${queryParams}` : url;
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

  private isValidToManyRelation(objects: Array<any>): boolean {
    let isJsonApiModel = objects.every(item => item instanceof JsonApiModel);
    let relationshipType: string = isJsonApiModel ? objects[0].modelConfig.type : '';
    return isJsonApiModel ? objects.every((item: JsonApiModel) => item.modelConfig.type === relationshipType) : false;
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

  private extractQueryData<T extends JsonApiModel>(res: any, model: T, withMeta = false): T[] | JsonApiQueryData<T> {
    const models: T[] = [];

    res.data.forEach((data: any) => {
      const m: T = this.deserializeModel(model, data);

      if (res.included) {
        m.syncRelationships(data, res.included, 0, this);
      }

      models.push(m);
    });

    if (withMeta && withMeta === true) {
      return new JsonApiQueryData(models, this.parseMeta(res, model));
    } else {
      return models;
    }
  }

  private deserializeModel<T extends JsonApiModel>(modelType: ModelType<T>, data: any) {
    data.attributes = this.transformSerializedNamesToPropertyNames(modelType, data.attributes);
    return new modelType(data);
  }

  private extractRecordData<T extends JsonApiModel>(res: HttpResponse, modelType: ModelType<T>, model?: T): T {
    let body: any = res.body;
    if (!body) {
      throw new Error('no body in response');
    }
    model = this.deserializeModel(modelType, body.data);
    if (body.included) {
      model.syncRelationships(body.data, body.included, 0, this);
    }
    return model;
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

  protected parseMeta(body: any, modelType: ModelType<JsonApiModel>): any {
    const metaModel: any = Reflect.getMetadata('JsonApiModelConfig', modelType).meta;
    const jsonApiMeta = new metaModel();

    for (let key in body) {
      if (jsonApiMeta.hasOwnProperty(key)) {
        jsonApiMeta[key] = body[key];
      }
    }
    return jsonApiMeta;
  }

  private toQueryString(params: any) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
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

  private transformSerializedNamesToPropertyNames<T extends JsonApiModel>(modelType: ModelType<T>, attributes: any) {
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
