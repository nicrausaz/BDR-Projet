import {Description, Property} from "@tsed/schema";

export function Hydrator(options?: {alias?: string, model?: typeof Model}): PropertyDecorator {
  return (target: {} | any, propertyKey: PropertyKey): any => {
    target["__hydrated_props"] = [...target["__hydrated_props"] ?? [], [propertyKey, options?.alias, options?.model]];
    target[propertyKey] = null;
  };
}

export default abstract class Model {
  @Property()
  __typename: string = this.constructor.name;

  protected __hydrated_props: [name: string, alias?: string, model?: Model][];

  public static hydrate(data: {[key: string]: any}) {
    return (new (this as any)()).hydrate(data);
  }

  public hydrate(data: {[key: string]: any}) {
    for (const [name, alias, model] of this.__hydrated_props) {
      const d = data[alias ?? name];
      if (d) {
        (this as any)[name] = model ? model.hydrate(d) : d;
      }
    }
    return this;
  }
}
