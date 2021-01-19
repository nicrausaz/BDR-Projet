import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";
import Sport from "@/models/Sport";
import API from "@/plugins/API";

@ModelDecorator
export default class Club extends Model {
  @Property() @PrimaryKey() id!: number;
  @Property() name!: string;
  @Property({model: Sport}) sport!: Sport;

  get avatar() {
    return API.getUrl(`api/club/${this.id}/avatar`);
  }
}
