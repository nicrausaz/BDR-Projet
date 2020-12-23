import {Enum, Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Player extends Model {
  @Hydrator()
  @Property()
  uid: string;

  @Hydrator()
  @Property()
  lastname: string;

  @Hydrator()
  @Property()
  firstname: string;

  @Hydrator()
  @Property()
  birthdate: Date;

  @Hydrator()
  @Property()
  height: number;

  @Hydrator()
  @Property()
  weight: number;

  @Hydrator()
  @Property()
  @Enum("M", "F")
  sex: "M" | "F";

  @Property()
  get avatar(): string {
    return `http://localhost:8083/api/player/${this.uid}/avatar`;
  }
}
