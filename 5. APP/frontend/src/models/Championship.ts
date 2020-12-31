import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Season from "@/models/Season";
import League from "@/models/League";

@ModelDecorator
export default class Championship extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property({model: Season}) season!: Season;
  @Property({model: League}) league!: League;
}
