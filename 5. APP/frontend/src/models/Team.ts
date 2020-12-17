import Model, {Property} from "@/models/Model";
import Club from "@/models/Club";
import League from "@/models/League";

export default class Team extends Model {
  @Property() id!: number;
  @Property() name!: string;
  @Property() club!: Club;
  @Property() league!: League;
}
