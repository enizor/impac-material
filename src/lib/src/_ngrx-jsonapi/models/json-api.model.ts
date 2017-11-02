import { ModelConfig } from '../interfaces/model-config.interface';

export class JsonApiModel {
  id: string;
  [key: string]: any;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      Object.assign(this, data.attributes);
    }
  }

  syncRelationships(data: any, included: any, level: number): void {
    if (data) {
      this.parseHasMany(data, included, level);
      this.parseBelongsTo(data, included, level);
    }
  }

  get modelConfig(): ModelConfig {
    return Reflect.getMetadata('JsonApiModelConfig', this.constructor);
  }

  private parseHasMany(data: any, included: any, level: number): void {
    let hasMany: any = Reflect.getMetadata('HasMany', this);
    if (hasMany) {
      for (let metadata of hasMany) {
        let relationship: any = data.relationships ? data.relationships[metadata.relationship] : null;
        if (relationship && relationship.data && relationship.data.length > 0) {
          console.log('### DEBUG in parseHasMany: relationship', relationship);
        }
      }
    }
  }

  private parseBelongsTo(data: any, included: any, level: number): void {
    let belongsTo: any = Reflect.getMetadata('BelongsTo', this);
    if (belongsTo) {
      for (let metadata of belongsTo) {
        let relationship: any = data.relationships ? data.relationships[metadata.relationship] : null;
        if (relationship && relationship.data) {
          console.log('### DEBUG in parseBelongsTo: relationship', relationship);
        }
      }
    }
  }
}
