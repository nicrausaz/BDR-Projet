import Player from "@/models/Player";
import {Property} from "@/models/Model";

export default class PlayerTeam extends Player {
  @Property() jerseyNumber!: number;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() clubId!: number;
  @Property() leagueId!: number;
  @Property() teamId!: number;
}
