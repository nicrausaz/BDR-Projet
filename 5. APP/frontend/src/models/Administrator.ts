import Model from "@/models/Model";

export default interface Administrator extends Model {
  uid: string;
  email: string;
  lastname: string;
  firstname: string;
  password: string;
}
