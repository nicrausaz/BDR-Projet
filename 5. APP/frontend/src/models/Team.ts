import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Club from "@/models/Club";
import League from "@/models/League";

@ModelDecorator
export default class Team extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() club!: Club;
  @Property() league!: League;
}
