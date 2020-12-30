import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Stadium from "@/models/Stadium";

@ModelDecorator
export default class Event extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() createdAt!: Date;
  @Property() updatedAt!: Date;
  @Property() stadium!: Stadium;
}
