import {Controller, Delete, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import League from "../../models/League";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";
import Federation from "../../models/Federation";

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
  async get(@PathParams("id") id: string) {
    const query = await DB.query(
        `SELECT *
         FROM league
         WHERE id = $1`, [id]);
    const result = query.rows.map(r => League.hydrate<League>(r))[0];
    if (result) return result;
    throw new NotFound("League not found");
  }
}

