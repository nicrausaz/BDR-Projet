import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Sport extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
}
