import Model, {Hydrator} from "./Model";
import {Property} from "@tsed/schema";
import bcrypt from "bcrypt";
import Permission from "./Permission"

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
  password: string;

  @Hydrator()
  allowedRessources: Permission[];

  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public verifyPasswordSync(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
