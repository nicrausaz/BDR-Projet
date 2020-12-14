import Championship from "./Championship";
import Team from "./Team";
import Event from "./Event";
import {Hydrator} from "./Model";
import {Property} from "@tsed/schema";

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

  @Hydrator()
  @Property()
  championship: Championship;

  @Hydrator()
  @Property()
  teamHome: Team;

  @Hydrator()
  @Property()
  teamGuest: Team;

}
