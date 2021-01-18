import {Controller, Delete, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import League from "../../models/League";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";
import Championship from "../../models/Championship";

@Controller("/league")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class LeagueController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const page = new Paginator(League)
      .setTotalQuery(`
          SELECT count(*)
          FROM league
          WHERE level ILIKE $1
            AND active = TRUE
      `)
      .setQuery(`
          SELECT l.*
          FROM league l
          WHERE l.level ILIKE $1
            AND l.active = TRUE
          ORDER BY l.level
      `)
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(
      `SELECT *, row_to_json(f.*) as federation
       FROM league l
                INNER JOIN federation f on f.id = l.federationid AND f.active = TRUE
       WHERE l.id = $1
         AND l.active = TRUE`, [id]);
    const result = query.rows.map(r => League.hydrate<League>(r))[0];
    if (result) return result;
    throw new NotFound("League not found");
  }

  @Get("/:id/championships")
  @ContentType("json")
  async getChampionships(@PathParams("id") id: number) {
    const query = await DB.query(
      `SELECT *, row_to_json(l.*) as league
       FROM league l
                INNER JOIN championship c ON l.id = c.leagueid
       WHERE l.id = $1
         AND c.active = TRUE`, [id]);

    const result = query.rows.map(r => Championship.hydrate<Championship>(r));
    if (result) return result;
    throw new NotFound("League not found");
  }
}

