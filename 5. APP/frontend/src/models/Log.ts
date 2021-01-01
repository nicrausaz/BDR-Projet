import Model, {ModelDecorator, PrimaryKey, Property} from "@/models/Model";

@ModelDecorator
export default class Log extends Model {
  @PrimaryKey()
  @Property()
  id!: number;

  @Property()
  event!: string;

  @Property({alias: "resourceid"})
  resourceId!: string;

  @Property({alias: "tablename"})
  tableName!: string;

  @Property()
  operation!: "update" | "delete" | "insert";

  @Property({alias: "executedat"})
  executedAt!: Date;
}
