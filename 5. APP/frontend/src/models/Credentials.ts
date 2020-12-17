import {Property} from "@/models/Model";

export default class Credentials {
  @Property() email!: string;
  @Property() password!: string;
}
