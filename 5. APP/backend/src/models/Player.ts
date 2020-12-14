import {Enum, Property} from "@tsed/schema";
import {Hydrator} from './Model';

export default class Player {
   @Hydrator()
   @Property()
   uuid: string;

   @Hydrator()
   @Property()
   lastname: string;

   @Hydrator()
   @Property()
   firstname: string;

   @Hydrator()
   @Property()
   birthdate: Date;

   @Hydrator()
   @Property()
   height: number;

   @Hydrator()
   @Property()
   weight: number;

   @Hydrator()
   @Property()
   @Enum("M", "F")
   sex: "M" | "F";
}
