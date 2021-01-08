import Model, {Hydrator} from "./Model";
import {Property} from "@tsed/schema";

export default class Season extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator()
  @Property()
  startAt: Date;

  @Hydrator()
  @Property()
  endAt: Date;
}
