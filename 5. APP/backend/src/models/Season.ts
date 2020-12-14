import {Hydrator} from './Model';
import {Property} from '@tsed/schema';

export default class Season {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator({alias: "startat"})
  @Property()
  startAt: Date;

  @Hydrator({alias: "endat"})
  @Property()
  endAt: Date;
}
