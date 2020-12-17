import Model, {Property} from "@/models/Model";

export default class Season extends Model {
  @Property() id!: number;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
}
