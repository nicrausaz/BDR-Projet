import {Enum, Property} from "@tsed/schema";

export default class League {

  @Property()
  id: number;

  @Property()
  level: string;

  @Property()
  @Enum("M", "F")
  gender: "M" | "F";
}
