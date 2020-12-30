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
}
