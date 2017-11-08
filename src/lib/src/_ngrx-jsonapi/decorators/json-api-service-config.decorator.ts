export function JsonApiServiceConfig(config: any = {}) {
  return function (target: any) {
    Reflect.defineMetadata('JsonApiServiceConfig', config, target);
  };
}
