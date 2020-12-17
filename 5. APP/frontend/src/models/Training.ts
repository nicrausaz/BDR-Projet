import Event from "@/models/Event";
import Team from "@/models/Team";
import {Property} from "@/models/Model";

export default class Training extends Event {
  @Property() description!: string;
  @Property() team!: Team;
}
