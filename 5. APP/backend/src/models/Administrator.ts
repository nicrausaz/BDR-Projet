import {Hydrator} from './Model';
import {Property} from '@tsed/schema';

export default class Administrator {
  @Hydrator()
  @Property()
  uuid: string;

  @Hydrator()
  @Property()
  email: string;

  @Hydrator()
  @Property()
  lastname: string;

  @Hydrator()
  @Property()
  firstname: string;

  @Hydrator()
  @Property()
  password: string;
}
