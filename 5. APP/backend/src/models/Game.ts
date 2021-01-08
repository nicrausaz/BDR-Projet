import Championship from "./Championship";
import Team from "./Team";
import Event from "./Event";
import {Hydrator} from "./Model";
import {Allow, Property} from "@tsed/schema";

export default class Game extends Event {
  @Hydrator()
  @Property()
  scoreHome: number;

  @Hydrator()
  @Property()
  scoreGuest: number;

  @Hydrator()
  @Property()
  canceled: boolean;

  @Hydrator()
  @Property()
  gameId: string;

  @Hydrator({model: Championship})
  @Property()
  @Allow({}, null)
  championship: Championship;

  @Hydrator({model: Team})
  @Property()
  @Allow({}, null)
  teamHome: Team;

  @Hydrator({model: Team})
  @Property()
  @Allow({}, null)
  teamGuest: Team;

}
