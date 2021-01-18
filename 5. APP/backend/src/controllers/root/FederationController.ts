import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Federation from "../../models/Federation";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";
import League from "../../models/League";

@Controller("/federation")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class FederationController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const page = new Paginator(Federation)
      .setTotalQuery(`
          SELECT count(*)
          FROM federation
          WHERE name ILIKE $1
            AND active = TRUE
      `)
      .setQuery(`
          SELECT f.*
          FROM federation f
          WHERE f.name ILIKE $1
            AND f.active = TRUE
          ORDER BY f.name
      `)
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Get("/:id")
  @ContentType("json")
  async get(
    @PathParams("id") id: number
  ) {
    const query = await DB.query(
        `SELECT f.*, row_to_json(s.*) as sport
         FROM federation f
                  INNER JOIN sport s ON s.id = f.sportid
         WHERE f.id = $1`, [id]);
    const result = query.rows.map(r => Federation.hydrate<Federation>(r))[0];
    if (result) return result;
    throw new NotFound("Federation not found");
  }

  @Get("/:id/leagues")
  @ContentType("json")
  async getLeagues(
    @PathParams("id") id: number
  ) {
    const query = await DB.query(
        `SELECT *
         FROM league l
         WHERE l.active = TRUE
           AND l.federationid = $1`, [id]);
    const result = query.rows.map(r => League.hydrate<League>(r));
    if (result) return result;
    throw new NotFound("Federation not found");
  }
}

