import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import {Authenticate} from "@tsed/passport";
import {ContentType} from "@tsed/schema";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import DB, {PoolClient} from "../../db/DB";
import League from "../../models/League";
import Paginator from "../../utils/Paginator";

@Controller("/league")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyLeagueController {

  @Get("/")
  @ContentType("json")
  async getAllLeagues(@Req() request: Req,
                      @QueryParams("q")query: string = "",
                      @QueryParams("limit")limit: number = 20,
                      @QueryParams("offset")offset: number = 0) {
    const perms = await Utils.getAccessibleLeagueRessources(<Administrator>request.user);

    return new Paginator(League)
      .setTotalQuery(`
          SELECT count(*)
          FROM league
          WHERE id = ANY ($1)
            AND level ILIKE $2
            AND active = TRUE
      `, [perms])
      .setQuery(`
          SELECT l.*,
                 row_to_json(f.*) as federation
          FROM league l
                   INNER JOIN federation f on l.federationid = f.id
          WHERE l.id = ANY ($1)
            AND l.level ILIKE $2
            AND l.active = TRUE
      `, [perms])
      .create({query, limit, offset});
  }

  @Put("/")
  @ContentType("json")
  async insertLeague(@Req() request: Req, @BodyParams() league: League) {

    if (!await Utils.checkAccessToFederationResource(<Administrator>request.user, league.federation.id)) throw new Unauthorized("Unauthorized Resource");
    const result = await DB.query(`INSERT INTO league (level, gender, federationid)
                                   VALUES ($1, $2, $3)
                                   RETURNING *`, [league.level, league.gender, league.federation.id]);

    return result.rows.map(r => League.hydrate<League>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async updateLeague(@Req() request: Req, @BodyParams() league: League, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToLeagueResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`UPDATE league
                                   SET level  = $1,
                                       gender = $2
                                   WHERE id = $3
                                   RETURNING *`,
      [league.level, league.gender, id]);

    return result.rows.map((r) => League.hydrate<League>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async deleteLeague(@Req() request: Req, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToLeagueResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const client = await PoolClient();

    try {
      await client.query("BEGIN");

      await client.query(`UPDATE league
                          SET active = FALSE
                          WHERE id = $1`, [id]);

      await client.query(`UPDATE championship
                          SET active = FALSE
                          WHERE leagueid = $1`, [id]);

      await client.query("COMMIT");

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
