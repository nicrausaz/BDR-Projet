import {Enum, Property} from "@tsed/schema";
import {Hydrator} from './Model';

export default class League {

  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  level: string;

  @Hydrator()
  @Property()
  @Enum("M", "F")
  gender: "M" | "F";
}
