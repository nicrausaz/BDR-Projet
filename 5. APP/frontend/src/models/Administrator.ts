import Model, {Property} from "@/models/Model";

export default class Administrator extends Model {
  @Property() uid!: string;
  @Property() email!: string;
  @Property() lastname!: string;
  @Property() firstname!: string;
  @Property() password!: string;
}
