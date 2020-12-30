import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Player extends Model {
  @Property() @PrimaryKey() uid!: string;
  @Property() lastname!: string;
  @Property() firstname!: string;
  @Property() birthdate!: Date;
  @Property() height!: number;
  @Property() weight!: number;
  @Property() sex!: "M" | "F";
  @Property() avatar!: string;
}
