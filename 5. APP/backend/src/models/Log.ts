import {Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Log extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  event: string;

  @Hydrator()
  @Property()
  resourceId: string;

  @Hydrator()
  @Property()
  tableName: string;

  @Hydrator()
  @Property()
  operation: string;

  @Hydrator()
  @Property()
  executedAt: Date;
}
