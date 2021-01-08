import Team from "./Team";
import Event from "./Event";
import {Allow, Property} from "@tsed/schema";
import {Hydrator} from "./Model";

export default class Training extends Event {
  @Hydrator()
  @Property()
  description: string;

  @Hydrator()
  @Property({model: Team})
  @Allow({}, null)
  team: Team;
}
