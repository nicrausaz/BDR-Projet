import Model from "@/models/Model";

export default interface Stadium extends Model {
  id: number;
  name: string;
  address: string;
  capacity: number;
}
