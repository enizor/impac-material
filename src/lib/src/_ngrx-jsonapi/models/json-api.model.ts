import find from 'lodash-es/find';
import { ModelConfig } from '../interfaces/model-config.interface';
import { JsonapiService, ModelType } from '../services/jsonapi-service';

export class JsonApiModel {
  id: string;
  [key: string]: any;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      Object.assign(this, data.attributes);
    }
  }

  syncRelationships(data: any, included: any, level: number, service: JsonapiService): void {
    if (data) {
      this.parseHasMany(data, included, level, service);
      this.parseBelongsTo(data, included, level);
    }
  }

  get modelConfig(): ModelConfig {
    return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
  }

  private parseHasMany(data: any, included: any, level: number, service: JsonapiService): void {
    let hasMany: any = Reflect.getMetadata('HasMany', this);
    if (hasMany) {
      for (let metadata of hasMany) {
        let relationship: any = data.relationships ? data.relationships[metadata.relationship] : null;
        if (relationship && relationship.data && relationship.data.length > 0) {
          let typeName: string = relationship.data[0].type;
          let modelType: ModelType<this> = Reflect.getMetadata('JsonApiServiceConfig', service.constructor).models[typeName];
          if (modelType) {
            let relationshipModel: JsonApiModel[] = this.getHasManyRelationship(modelType, relationship.data, included, typeName, level, service);
            if (relationshipModel.length > 0) {
              this[metadata.propertyName] = relationshipModel;
            }
          } else {
            throw {message: 'parseHasMany - Model type for relationship ' + typeName + ' not found.'};
          }
        }
      }
    }
  }

  private parseBelongsTo(data: any, included: any, level: number, service: JsonapiService): void {
    let belongsTo: any = Reflect.getMetadata('BelongsTo', this);
    if (belongsTo) {
      for (let metadata of belongsTo) {
        let relationship: any = data.relationships ? data.relationships[metadata.relationship] : null;
        if (relationship && relationship.data) {
          let dataRelationship: any = (relationship.data instanceof Array) ? relationship.data[0] : relationship.data;
          if (dataRelationship) {
            let typeName: string = dataRelationship.type;
            let modelType: ModelType<this> = Reflect.getMetadata('JsonApiServiceConfig', service.constructor).models[typeName];
            if (modelType) {
              let relationshipModel = this.getBelongsToRelationship(modelType, dataRelationship, included, typeName, level, service);
              if (relationshipModel) {
                this[metadata.propertyName] = relationshipModel;
              }
            } else {
              throw { message: 'parseBelongsTo - Model type for relationship ' + typeName + ' not found.' };
            }
          }
        }
      }
    }
  }

  private getHasManyRelationship<T extends JsonApiModel>(modelType: ModelType<T>, data: any, included: any, typeName: string, level: number, service: JsonapiService): T[] {
    let relationshipList: T[] = [];
    data.forEach((item: any) => {
      let relationshipData: any = find(included, {id: item.id, type: typeName});
      if (relationshipData) {
        let newObject: T = this.create(modelType, relationshipData);
        if (level <= 1) {
          newObject.syncRelationships(relationshipData, included, level + 1, service);
        }
        relationshipList.push(newObject);
      }
    });
    return relationshipList;
  }

  private getBelongsToRelationship<T extends JsonApiModel>(modelType: ModelType<T>, data: any, included: any, typeName: string, level: number, service: JsonapiService): T | null {
    let id: string = data.id;
    let relationshipData: any = find(included, {id: id, type: typeName});
    if (relationshipData) {
      let newObject: T = this.create(modelType, relationshipData);
      if (level <= 1) {
        newObject.syncRelationships(relationshipData, included, level + 1, service);
      }
      return newObject;
    }
    return null;
  }

  private create<T extends JsonApiModel>(modelType: ModelType<T>, data: any): T {
    let newObject: T = new modelType(data);
    return newObject;
  }
}
