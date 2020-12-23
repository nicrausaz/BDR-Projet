import {BodyParams, Controller, Get, Patch, PathParams, Put, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Season from "../../models/Season";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../../Utils";

@Controller("/season")
@Authenticate()
export class SeasonController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return Utils.createSimpleSearchPaginate(Season, "season", ["name"], query, limit, offset);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(`SELECT *
                                  FROM season
                                  WHERE id = $1`, [id]);
    const result = query.rows.map(r => Season.hydrate<Season>(r))[0];
    if (result) return result;
    throw new NotFound("Season not found");
  }

  @Put("/")
  @ContentType("json")
  async put(@BodyParams() season: Season) {
    const result = await DB.query(`INSERT INTO season(name, startat, endat)
                                   VALUES ($1, $2, $3)
                                   RETURNING *`, [season.name, season.startAt, season.endAt]);

    return result.rows.map((r) => Season.hydrate<Season>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@PathParams("id") id: number, @BodyParams() season: Season) {
    const result = await DB.query(`UPDATE season
                                   SET name    = $1,
                                       startat = $2,
                                       endat   = $3
                                   WHERE id = $4
                                   RETURNING *`, [season.name, season.startAt, season.endAt, id]);

    return result.rows.map((r) => Season.hydrate<Season>(r))[0];
  }
}
