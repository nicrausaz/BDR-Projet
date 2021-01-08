import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class CalendarEntry extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
  @Property() eventType!: "training" | "game";

  get color() {
    switch (this.eventType) {
      case "training":
        return "#c80b0b";
      case "game":
        return "#119215";
    }
    return "primary";
  }

  get start() {
    return this.startAt?.toISOString().substr(0, 10);
  }

  get end() {
    return this.endAt?.toISOString().substr(0, 10);
  }
}
