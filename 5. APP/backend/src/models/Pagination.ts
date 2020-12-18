import {Property} from "@tsed/schema";
import Model from "./Model";

export default class Pagination<T extends Model> extends Model{
  @Property()
  total: number;

  @Property()
  offset: number;

  @Property()
  limit: number;

  @Property()
  result: T[];

  static create<T extends Model>(result: T[], total: number, limit: number = 20, offset: number = 0) {
    const p = new Pagination<T>();
    p.result = result;
    p.total = total;
    p.limit = limit;
    p.offset = offset;
    return p;
  }
}
