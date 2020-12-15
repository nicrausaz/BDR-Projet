import Event from "@/models/Event";
import Team from "@/models/Team";

export default interface Training extends Event {
  description: string;
  team: Team;
}
