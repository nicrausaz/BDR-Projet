import {Min, Property} from "@tsed/schema";

export default class Stadium {
  @Property()
  id: number;

  @Property()
  name: string;

  @Property()
  address: string;

  @Property()
  @Min(0)
  capacity: number;
}
