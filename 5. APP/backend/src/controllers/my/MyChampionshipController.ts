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
          SELECT c.*,row_to_json(l.*)  as league
          FROM championship as c
          INNER JOIN league l on l.id = c.leagueid
          WHERE c.id = ANY ($1)
            AND c.name ILIKE $2
          ORDER BY c.name
      `, [perms])
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Put("/")
  @ContentType("json")
  async insertChampionship(@Req() request: Req, @BodyParams() championship: Championship) {

    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, championship.id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`INSERT INTO championship (name, startat, endat, leagueid)
                                   VALUES ($1, $2, $3, $4)
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, championship.league.id]);

    return result.rows.map(r => Championship.hydrate<Championship>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async updateChampionship(@Req() request: Req, @PathParams("id") id: number, @BodyParams() championship: Championship) {

    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, championship.id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`UPDATE championship
                                   SET name     = $1,
                                       startat  = $2,
                                       endat    = $3
                                   WHERE id = $4
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, id]
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
