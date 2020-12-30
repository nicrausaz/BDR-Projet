import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Administrator extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() email!: string;
  @Property() lastname!: string;
  @Property() firstname!: string;
  @Property() password!: string;
  @Property() avatar!: string;
}
