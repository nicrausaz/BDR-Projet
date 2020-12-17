import Model, {Property} from "@/models/Model";
import Stadium from "@/models/Stadium";

export default class Event extends Model {
  @Property() uid!: string;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() createdAt!: Date;
  @Property() updatedAt!: Date;
  @Property() stadium!: Stadium;
}
