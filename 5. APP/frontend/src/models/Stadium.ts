import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Stadium extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() address!: string;
  @Property() capacity!: number;
}
