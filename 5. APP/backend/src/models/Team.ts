import Club from "./Club";
import League from "./League";
import {Property} from '@tsed/schema';
import {Hydrator} from './Model';

export default class Team {
  @Hydrator() @Property() id: number;
  @Hydrator() @Property() name: string;
  @Hydrator() @Property() club: Club;
  @Hydrator() @Property() league: League;
}
