import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, Req, UseBefore} from "@tsed/common";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import {Authenticate} from "@tsed/passport";
import {ContentType} from "@tsed/schema";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import DB from "../../db/DB";
import League from "../../models/League";

@Controller("/league")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyLeagueController {

  @Get("/")
  @ContentType("json")
  async getAllLeagues(@Req() request: Req) {
    const perms = await Utils.getAccessibleLeagueRessources(<Administrator>request.user);

    const result = await DB.query(`SELECT *, row_to_json(f.*) as federation
                                   FROM league l
                                            INNER JOIN federation f on l.federationid = f.id
                                   WHERE l.id = ANY ($1)`, [perms]);

    return result.rows.map(r => League.hydrate<League>(r));
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

  /**
   * DELETE league
   * @param request
   * @param id
   */
  @Delete("/:id")
  @ContentType("json")
  async deleteLeague(@Req() request: Req, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToLeagueResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    await DB.query(`DELETE
                    FROM league
                    WHERE id = $1`, [id]);
  }
}
