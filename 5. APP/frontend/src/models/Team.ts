import Model from "@/models/Model";
import Club from "@/models/Club";
import League from "@/models/League";

export default interface Team extends Model {
  id: number;
  name: string;
  club: Club;
  league: League;
}
