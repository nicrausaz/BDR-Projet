import Team from "@/models/Team";
import Event from "@/models/Event";
import {ModelDecorator, Property} from "@/models/Model";

@ModelDecorator
export default class Training extends Event {
  @Property() description!: string;
  @Property({model: Team}) team!: Team;
}
