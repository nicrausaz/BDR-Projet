import Model from "@/models/Model";
import Stadium from "@/models/Stadium";

export default interface Event extends Model {
  uid: string;
  name: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  stadium: Stadium;
}
