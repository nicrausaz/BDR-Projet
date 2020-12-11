import Stadium from "./Stadium";

export default class Event {
  uuid: string;
  name: string;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  stadium: Stadium;
}
