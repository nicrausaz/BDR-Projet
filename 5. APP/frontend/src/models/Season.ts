import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Season extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property() startAt!: Date;
  @Property() endAt!: Date;
}
