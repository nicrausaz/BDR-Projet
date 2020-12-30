import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class League extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() level!: string;
  @Property() gender!: "M" | "F";
}
