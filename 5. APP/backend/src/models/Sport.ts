import {Property} from "@tsed/schema";
import {Hydrator} from './Model';

export default class Sport {
  @Hydrator() @Property() id: number;
  @Hydrator() @Property() name: string;
}
