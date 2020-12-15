import Model from "@/models/Model";

export default interface Season extends Model {
  id: number;
  name: string;
  startAt: Date;
  endAt: Date;
}
