import Stadium from "./Stadium";
import Model, {Hydrator} from "./Model";
import {Allow, Property} from "@tsed/schema";

export default class Event extends Model {
  @Hydrator()
  @Property()
  uid: string;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator()
  @Property()
  startAt: Date;

  @Hydrator()
  @Property()
  endAt: Date;

  @Hydrator()
  @Property()
  createdAt: Date;

  @Hydrator()
  @Property()
  updatedAt: Date;

  @Hydrator({model: Stadium})
  @Property()
  @Allow({}, null)
  stadium: Stadium;
}
