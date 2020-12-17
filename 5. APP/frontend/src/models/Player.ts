import Model, {Property} from "@/models/Model";

export default class Player extends Model {
  @Property() uid!: string;
  @Property() lastname!: string;
  @Property() firstname!: string;
  @Property() birthdate!: Date;
  @Property() height!: number;
  @Property() weight!: number;
  @Property() sex!: "M" | "F";
}
