import {Min, Property} from "@tsed/schema";
import {Hydrator} from './Model';

export default class Stadium {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator()
  @Property()
  address: string;

  @Hydrator()
  @Property()
  @Min(0)
  capacity: number;
}
