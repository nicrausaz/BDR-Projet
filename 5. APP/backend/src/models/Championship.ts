import Season from "./Season";
import League from "./League";
import {Property} from "@tsed/schema";
import {DateMapper} from "@tsed/json-mapper";
import Model, {Hydrator} from "./Model";

export default class Championship extends Model {
   @Property()
   @Hydrator()
   id: number;

   @Property()
   @Hydrator()
   name: string;

   @Property(DateMapper)
   @Hydrator({alias: "startat"})
   startAt: Date;

   @Property(DateMapper)
   @Hydrator({alias: "endat"})
   endAt: Date;

   @Property()
   @Hydrator()
   season: Season;

   @Property()
   @Hydrator()
   league: League;
}
