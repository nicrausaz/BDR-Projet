import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import League from "@/models/League";

@ModelDecorator
export default class Championship extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property({model: League}) league!: League;

  get fullName(): string {
    return `${this.league.level} ${this.name} (${this.league.gender})`;
  }
}
