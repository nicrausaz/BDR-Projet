import Season from "./Season";
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
  startAt: Date;

  @Property()
  @Hydrator()
  endAt: Date;

  @Property()
  @Hydrator()
  @Allow({}, null)
  season: Season;

  @Property()
  @Hydrator()
  @Allow({}, null)
  league: League;
}
