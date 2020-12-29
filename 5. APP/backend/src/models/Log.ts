import {Property} from "@tsed/schema";
import Model, {Hydrator} from "./Model";

export default class Log extends Model {
  @Hydrator()
  @Property()
  id: number;

  @Hydrator()
  @Property()
  event: string;

  @Hydrator({alias: "ressourceid"})
  @Property()
  ressourceId: string;

  @Hydrator({alias: "executedat"})
  @Property()
  executedAt: Date;
}
