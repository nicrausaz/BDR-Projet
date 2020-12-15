import Model from "@/models/Model";

export default interface League extends Model {
  id: number;
  level: string;
  gender: "M" | "F";
}
