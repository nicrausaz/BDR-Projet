import Model, {Property} from "@/models/Model";

export default class Stadium extends Model {
  @Property() id!: number;
  @Property() name!: string;
  @Property() address!: string;
  @Property() capacity!: number;
}
