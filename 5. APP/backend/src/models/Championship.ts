import Season from "./Season";
import League from "./League";
import {DateTime, Format, Name, Property} from "@tsed/schema";
import {DateMapper} from "@tsed/json-mapper";

export default class Championship {
  @Property()
  id: number;

  @Property()
  name: string;

  @Property(DateMapper)
  startAt: Date;

  @Property(DateMapper)
  endAt: Date;

  @Property()
  season: Season;

  @Property()
  league: League;
}
