import {Controller, Get, QueryParams, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {ContentType, Returns} from "@tsed/schema";
import Championship from "../../models/Championship";
import Paginator from "../../utils/Paginator";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";

@Controller("/championship")
@Authenticate()
export class MyChampionshipController {

  @Get("/")
  @(Returns(200, Championship).Of(Championship).Description("All Championship"))
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0) {
    const perms = await Utils.getAccessibleChampionshipResources(<Administrator>request.user);
    const page = new Paginator(Championship)
      .setTotalQuery(`
          SELECT count(*)
          FROM championship
          WHERE id = ANY ($1)
            AND name ILIKE $2
      `, [perms])
      .setQuery(`
          SELECT *
          FROM championship
          WHERE id = ANY ($1)
            AND name ILIKE $2
          ORDER BY name
      `, [perms])
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

}
