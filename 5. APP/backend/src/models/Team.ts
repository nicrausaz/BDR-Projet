import Club from "./Club";
import League from "./League";
import {Allow, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Team extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator({model: Club})
  @Property()
  club: Club;

  @Hydrator({model: League})
  @Property()
  @Allow({}, null)
  league: League;
}
