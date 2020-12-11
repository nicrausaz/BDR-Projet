import Sport from "./Sport";
import {Property} from "@tsed/schema";

export default class Federation {
  @Property() id: number;
  @Property() name: string;
  @Property() sport: Sport;
}
