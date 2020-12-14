import Model, {Hydrator} from "./Model";
import {Property} from "@tsed/schema";
import bcrypt from "bcrypt";

export default class Administrator extends Model {
  @Hydrator()
  @Property()
  uid: string;

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

  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public verifyPasswordSync(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
