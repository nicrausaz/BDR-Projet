import Model, {Property} from "@/models/Model";

export default class League extends Model {
  @Property() id!: number;
  @Property() level!: string;
  @Property() gender!: "M" | "F";
}
