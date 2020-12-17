import Model, {Property} from "@/models/Model";

export default class Sport extends Model {
  @Property() id!: number;
  @Property() name!: string;
}
