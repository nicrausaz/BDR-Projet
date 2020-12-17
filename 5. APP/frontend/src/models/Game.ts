import Championship from "@/models/Championship";
import Team from "@/models/Team";
import Event from "@/models/Event";
import {Property} from "@/models/Model";

export default class Game extends Event {
  @Property() scoreHome!: number;
  @Property() scoreGuest!: number;
  @Property() canceled!: boolean;
  @Property() gameId!: string;
  @Property() championship!: Championship;
  @Property() teamHome!: Team;
  @Property() teamGuest!: Team;
}
