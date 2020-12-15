import Model from "@/models/Model";
import Sport from "@/models/Sport";

export default interface Club extends Model {
  id: number;
  name: string;
  sport: Sport;
}
