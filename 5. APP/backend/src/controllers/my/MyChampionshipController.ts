import {Controller, Get, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {ContentType, Returns} from "@tsed/schema";
import Championship from "../../models/Championship";
import DB from "../../db/DB";
import {Utils} from "../../Utils";
import Administrator from "../../models/Administrator";

@Controller("/my/championship")
@Authenticate()
export class MyChampionshipController {

  @Get("/")
  @(Returns(200, Championship).Of(Championship).Description("All Championship"))
  @ContentType("json")
  async getAll(@Req() request: Req) {
    // const perms = Utils.checkAccessToChampionshipRessource(<Administrator>request.user);
    const result = await DB.query(
      `SELECT *
         FROM championship`);
    return result.rows.map(r => Championship.hydrate<Championship>(r));
  }

}
