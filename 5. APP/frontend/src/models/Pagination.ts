import Model, {ModelDecorator, Property} from "./Model";

@ModelDecorator
export default class Pagination<T extends Model> extends Model {
  @Property()
  total!: number;

  @Property()
  offset!: number;

  @Property()
  limit!: number;

  @Property()
  result!: T[];

  public get nbPage(): number {
    return Math.ceil(this.total / this.limit);
  }
}
