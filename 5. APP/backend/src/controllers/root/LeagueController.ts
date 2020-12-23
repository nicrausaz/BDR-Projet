import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import League from "../../models/League";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";

@Controller("/league")
@Authenticate()
export class LeagueController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return Utils.createSimpleSearchPaginate(League, "league", ["level"], query, limit, offset);
  }

  @Get("/:id")
  @ContentType("json")
  async get(
    @PathParams("id") id: string
  ) {
    const query = await DB.query(
      `SELECT *
         FROM league
         WHERE id = $1`, [id]);
    const result = query.rows.map(r => League.hydrate<League>(r))[0];
    if (result) return result;
    throw new NotFound("League not found");
  }
}
