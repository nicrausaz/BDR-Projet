import {Controller, Get, PathParams, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType, Returns} from "@tsed/schema";
import DB from "../../db/DB";
import Championship from "../../models/Championship";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Administrator from "../../models/Administrator";
import Paginator from "../../utils/Paginator";

@Controller("/championship")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class ChampionshipController {

  @Get("/")
  @(Returns(200, Championship).Of(Championship).Description("All Championship"))
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0) {
    const page = new Paginator(Championship)
      .setTotalQuery(`
          SELECT count(*)
          FROM championship
          WHERE name ILIKE $1
      `)
      .setQuery(`
          SELECT c.*,row_to_json(l.*)  as league
          FROM championship as c
          INNER JOIN league l on l.id = c.leagueid
          WHERE c.name ILIKE $1
          ORDER BY c.name
      `, )
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: string) {
    const query = await DB.query(
      `SELECT *
       FROM championship
       WHERE id = $1`, [id]);

    const result = query.rows.map(r => Championship.hydrate<Championship>(r))[0];
    if (result) return result;
    throw new NotFound("Championship not found");
  }
}

