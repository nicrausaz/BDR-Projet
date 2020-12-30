import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Sport from "@/models/Sport";

@ModelDecorator
export default class Federation extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() sport!: Sport;
}
