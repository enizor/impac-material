import { ModelConfig } from '../_interfaces/model-config.interface';

export function JsonApiModelConfig(config: ModelConfig) {
  return function (target: any) {
    Reflect.defineMetadata('JsonApiModelConfig', config, target);
  };
}
