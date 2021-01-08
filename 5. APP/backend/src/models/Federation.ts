import Sport from "./Sport";
import {Allow, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Federation extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator({model: Sport})
  @Property()
  @Allow({}, null)
  sport: Sport;
}
