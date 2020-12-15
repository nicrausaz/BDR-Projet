import Model from "@/models/Model";
import Sport from "@/models/Sport";

export default interface Federation extends Model {
  id: number;
  name: string;
  sport: Sport;
}
