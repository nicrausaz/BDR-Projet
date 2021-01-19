import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Club from "@/models/Club";
import League from "@/models/League";
import API from "@/plugins/API";

@ModelDecorator
export default class Team extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property({model: Club}) club!: Club;
  @Property({model: League}) league!: League;

  get avatar() {
    return API.getUrl(`api/team/${this.id}/avatar`);
  }
}
