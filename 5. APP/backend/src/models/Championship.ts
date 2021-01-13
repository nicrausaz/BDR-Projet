import League from "./League";
import {Allow, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Championship extends Model {
  @Property()
  @Hydrator()
  id: number;

  @Property()
  @Hydrator()
  name: string;

  @Property()
  @Hydrator()
  startAt: string;

  @Property()
  @Hydrator()
  endAt: string;

  @Property()
  @Hydrator({model: League})
  @Allow({}, null)
  league: League;
}
