import {Allow, Property} from "@tsed/schema";
import {Hydrator} from "./Model";
import Club from "./Club";
import League from "./League";
import Team from "./Team";
import Player from "./Player";

export default class PlayerTeam extends Player {
  @Hydrator()
  @Property()
  jerseyNumber: number;

  @Hydrator()
  @Property()
  startAt: Date;

  @Hydrator()
  @Property()
  endAt: Date;

  @Hydrator({model: Club})
  @Property()
  @Allow({}, null)
  club: Club;

  @Hydrator({model: League})
  @Property()
  @Allow({}, null)
  league: League;

  @Hydrator({model: Team})
  @Property()
  @Allow({}, null)
  team: Team;
}
