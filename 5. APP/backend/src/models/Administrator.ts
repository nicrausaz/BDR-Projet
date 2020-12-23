import Model, {Hydrator} from "./Model";
import {Email, MinLength, Property, Required} from "@tsed/schema";
import bcrypt from "bcrypt";
import {Utils} from "../Utils";

export default class Administrator extends Model {
  @Hydrator()
  @Property()
  uid: string;

  @Hydrator()
  @Property()
  @Required()
  @Email()
  email: string;

  @Hydrator()
  @Property()
  @Required()
  lastname: string;

  @Hydrator()
  @Property()
  @Required()
  firstname: string;

  @Hydrator()
  @Required()
  @MinLength(8)
  password: string;

  @Property()
  get avatar() {
    return `http://localhost:8083/api/administrator/${this.uid}/avatar`;
  }

  public verifyPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public verifyPasswordSync(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}
