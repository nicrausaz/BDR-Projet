import Season from "./Season";
import League from "./League";

export default class Championship {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date;
  season: Season;
  league: League;
}
