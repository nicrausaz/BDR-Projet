import Model, {Hydrator} from "./Model";
import {Property} from "@tsed/schema";

export default class CalendarEntry extends Model {
  @Property()
  @Hydrator({alias: "uid"})
  uuid: string | null;

  @Property()
  @Hydrator()
  name: string;

  @Property()
  @Hydrator({alias: "startAt"})
  start: string;

  @Property()
  @Hydrator({alias: "endat"})
  end: string;

  @Property()
  @Hydrator()
  color: string = "#ff1517"
}
