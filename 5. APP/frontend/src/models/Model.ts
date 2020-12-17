export function Property(): PropertyDecorator {
  return (target: any, propertyKey) => {
    target[propertyKey] = null;
  };
}

export default class Model {
  @Property() __typename!: string;
}
