import Model from "@/models/Model";
import Season from "@/models/Season";
import League from "@/models/League";

export default interface Championship extends Model {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date;
  season: Season;
  league: League;
}
