import Model, {Property} from "@/models/Model";
import Season from "@/models/Season";
import League from "@/models/League";

export default class Championship extends Model {
  @Property() id!: number;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() season!: Season;
  @Property() league!: League;
}
