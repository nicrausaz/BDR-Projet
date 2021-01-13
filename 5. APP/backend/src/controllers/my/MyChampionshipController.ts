import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {ContentType, Returns} from "@tsed/schema";
import Championship from "../../models/Championship";
import Paginator from "../../utils/Paginator";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import {Unauthorized} from "@tsed/exceptions";
import DB from "../../db/DB";

@Controller("/championship")
@UseBefore(RouteLogMiddleware)
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

  @Put("/")
  @ContentType("json")
  async insertChampionship(@Req() request: Req, @BodyParams() championship: Championship) {

    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, championship.id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`INSERT INTO championship (name, startat, endat, seasonid, leagueid)
                                   VALUES ($1, $2, $3, $4, $5)
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, championship.season.id, championship.league.id]);

    return result.rows.map(r => Championship.hydrate<Championship>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async updateChampionship(@Req() request: Req, @PathParams("id") id: number, @BodyParams() championship: Championship) {

    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, championship.id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`UPDATE championship
                                   SET name     = $1,
                                       startat  = $2,
                                       endat    = $3,
                                       seasonid = $4
                                   WHERE id = $5
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, championship.season.id, id]
    );

    return result.rows.map(r => Championship.hydrate<Championship>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async deleteChampionship(@Req() request: Req, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    await DB.query(`UPDATE championship SET active = FALSE WHERE id = $1`, [id]);
  }


}
