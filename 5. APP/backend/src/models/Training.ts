import Team from "./Team";
import {Property} from '@tsed/schema';
import {Hydrator} from './Model';

export default class Training extends Event {
  @Hydrator()
  @Property()
  description: string;

  @Hydrator()
  @Property()
  team: Team;
}
