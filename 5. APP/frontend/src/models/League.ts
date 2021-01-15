import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Federation from "@/models/Federation";

@ModelDecorator
export default class League extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() level!: string;
  @Property() gender!: "M" | "F";
  @Property({model: Federation}) federation!: Federation;
}
