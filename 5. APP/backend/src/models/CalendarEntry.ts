import Model, {Hydrator} from "./Model";
import {Property} from "@tsed/schema";

export default class CalendarEntry extends Model {
  @Property()
  @Hydrator()
  uid: string | null;

  @Property()
  @Hydrator()
  name: string;

  @Property()
  @Hydrator()
  startAt: string;

  @Property()
  @Hydrator()
  endAt: string;

  @Property()
  @Hydrator()
  color: string = "#ff1517"
}
