import Player from "@/models/Player";

export default interface PlayerTeam extends Player {
  jerseyNumber: number;
  startAt: Date;
  endAt: Date;
  clubId: number;
  leagueId: number;
  teamId: number;
}
