import Stadium from "./Stadium";
import {Hydrator} from './Model';
import {Property} from '@tsed/schema';

export default class Event {
  @Hydrator()
  @Property()
  uuid: string;

  @Hydrator()
  @Property()
  name: string;

  @Hydrator()
  @Property()
  startAt: Date;

  @Hydrator()
  @Property()
  endAt: Date;

  @Hydrator()
  @Property()
  createdAt: Date;

  @Hydrator()
  @Property()
  updatedAt: Date;

  @Hydrator()
  @Property()
  stadium: Stadium;
}
