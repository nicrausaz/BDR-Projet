export function Property(options?: {alias?: string; model?: typeof Model}): PropertyDecorator {
  return (target: any, propertyKey) => {
    target.__hydratedProps = [...(target.__hydratedProps ?? []), [propertyKey, options?.alias]];
    target[propertyKey] = null;
  };
}

export function PrimaryKey(): PropertyDecorator {
  return (target: any, propertyKey) => {
    target.__primaryKey = propertyKey;
  };
}

export function ModelDecorator(model: typeof Model) {
  Model.list.set(model.name, model);
}

@ModelDecorator
export default class Model {
  public static list = new Map<string, typeof Model>();
  @Property() __typename!: string;
  private __primaryKey!: string;
  private __hydratedProps!: any[];

  constructor(data?: {[key: string]: any}) {
    if (data) this.hydrate(data);
  }

  public get primaryKey(): any {
    return (this as any)[this.__primaryKey];
  }

  public static hydrate<T extends Model>(data: {[key: string]: any}) {
    return new this().hydrate(data) as T;
  }

  public hydrate(data: {[key: string]: any}) {
    for (const [name, alias] of this.__hydratedProps) {
      const n = alias ?? name;
      const d = data[n] ?? data[n.toLowerCase()];
      if (d !== undefined) {
        if (Array.isArray(d)) {
          (this as any)[name] = d.map((f) => {
            const model = Model.list.get(f?.__typename);
            return model?.hydrate(f) ?? f;
          });
        } else {
          const model = Model.list.get(d?.__typename);
          (this as any)[name] = model?.hydrate(d) ?? d;
        }
      }
    }
    return this;
  }
}
