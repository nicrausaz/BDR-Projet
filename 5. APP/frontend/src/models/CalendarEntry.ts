import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class CalendarEntry extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() color!: string;

  get start() {
    return this.startAt?.toISOString().substr(0, 10);
  }

  get end() {
    return this.endAt?.toISOString().substr(0, 10);
  }
}
