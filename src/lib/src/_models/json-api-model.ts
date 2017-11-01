
export class JsonApiModel {
  id: string;
  [key: string]: any;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      Object.assign(this, data.attributes);
    }
  }
}
