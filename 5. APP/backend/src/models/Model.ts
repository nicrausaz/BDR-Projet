export function Hydrator(options?: {alias?: string}): PropertyDecorator {
  return (target: {} | any, propertyKey: PropertyKey): any => {
    target["__hydrated_props"] = [...target["__hydrated_props"] ?? [], [propertyKey, options?.alias]];
  };
}

export default class Model {
  protected __hydrated_props: [name: string, alias?: string][];

  public static hydrate(data: {[key: string]: any}) {
    return new this().hydrate(data);
  }

  public hydrate(data: {[key: string]: any}) {
    for (const [name, alias] of this.__hydrated_props) {
      const d = data[alias ?? name];
      if (d) (this as any)[name] = d;
    }
    return this;
  }
}
