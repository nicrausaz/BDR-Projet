import Club from "./Club";
import League from "./League";
import {Property} from '@tsed/schema';

export default class Team {
  @Property() id: number;
  @Property() name: string;
  @Property() club: Club;
  @Property() league: League;
}
