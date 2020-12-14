import {Property} from "@tsed/schema";
import {Hydrator} from "./Model";
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

  @Hydrator({alias: "clubid"})
  @Property()
  clubId: number;

  @Hydrator({alias: "leagueid"})
  @Property()
  leagueId: number;

  @Hydrator({alias: "teamid"})
  @Property()
  teamId: number;
}
