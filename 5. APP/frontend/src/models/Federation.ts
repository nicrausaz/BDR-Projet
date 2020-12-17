import Model, {Property} from "@/models/Model";
import Sport from "@/models/Sport";

export default class Federation extends Model {
  @Property() id!: number;
  @Property() name!: string;
  @Property() sport!: Sport;
}
