import Model, {Property} from "./Model";

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
