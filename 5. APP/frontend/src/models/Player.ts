import Model from "@/models/Model";

export default interface Player extends Model {
  uid: string;
  lastname: string;
  firstname: string;
  birthdate: Date;
  height: number;
  weight: number;
  sex: "M" | "F";
}
