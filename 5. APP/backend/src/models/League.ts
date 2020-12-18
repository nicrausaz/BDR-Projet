import {Enum, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";
import Federation from "./Federation";

export default class League extends Model {

  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  level: string;

  @Hydrator()
  @Property()
  @Enum("M", "F")
  gender: "M" | "F";

  @Hydrator({model: Federation})
  @Property()
  federation: Federation;
}
