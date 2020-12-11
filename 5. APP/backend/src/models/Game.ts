import Championship from "./Championship";
import Team from "./Team";
import Event from "./Event";

export default class Game extends Event {
  scoreHome: number;
  scoreGuest: number;
  canceled: boolean;
  gameId: string;
  championship: Championship;
  teamHome: Team;
  teamGuest: Team;

}
