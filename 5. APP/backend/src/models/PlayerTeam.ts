import {Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";
import Club from "./Club";
import League from "./League";
import Team from "./Team";
import Player from "./Player";

export default class PlayerTeam extends Player {
  @Hydrator({alias: "jerseynumber"})
  @Property()
  jerseyNumber: number;

  @Hydrator({alias: "startat"})
  @Property()
  startAt: Date;

  @Hydrator({alias: "endat"})
  @Property()
  endAt: Date;

  @Hydrator({model: Club})
  @Property()
  club: Club;

  @Hydrator({model: League})
  @Property()
  league: League;

  @Hydrator({model: Team})
  @Property()
  team: Team;
}
