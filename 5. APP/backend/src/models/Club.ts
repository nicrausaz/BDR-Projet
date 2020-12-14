import Sport from "./Sport";
import {Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Club extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator({model: Sport})
  @Property()
  sport: Sport;
}
