import Championship from "@/models/Championship";
import Team from "@/models/Team";
import Event from "@/models/Event";

export default interface Game extends Event {
  scoreHome: number;
  scoreGuest: number;
  canceled: boolean;
  gameId: string;
  championship: Championship;
  teamHome: Team;
  teamGuest: Team;
}
