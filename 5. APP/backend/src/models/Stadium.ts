import {Min, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Stadium extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator()
  @Property()
  address: string;

  @Hydrator()
  @Property()
  @Min(0)
  capacity: number;
}
