import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import API from "@/plugins/API";

@ModelDecorator
export default class Player extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() lastname!: string;
  @Property() firstname!: string;
  @Property() birthdate!: Date;
  @Property() height!: number;
  @Property() weight!: number;
  @Property() sex!: "M" | "F";

  get avatar() {
    return API.getUrl(`api/player/${this.uid}/avatar`);
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }
}
