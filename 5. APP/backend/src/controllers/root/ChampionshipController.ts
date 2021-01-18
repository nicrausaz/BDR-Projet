import {Controller, Get, PathParams, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType, Returns} from "@tsed/schema";
import DB from "../../db/DB";
import Championship from "../../models/Championship";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
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
            AND active = TRUE
      `)
      .setQuery(`
          SELECT c.*, row_to_json(l.*) as league
          FROM championship as c
                   INNER JOIN league l on l.id = c.leagueid
          WHERE c.name ILIKE $1
            AND c.active = TRUE
          ORDER BY c.name
      `)
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: string) {
    const query = await DB.query(
        `SELECT *
         FROM championship
         WHERE id = $1
           AND active = TRUE`, [id]);

    const result = query.rows.map(r => Championship.hydrate<Championship>(r))[0];
    if (result) return result;
    throw new NotFound("Championship not found");
  }
}

