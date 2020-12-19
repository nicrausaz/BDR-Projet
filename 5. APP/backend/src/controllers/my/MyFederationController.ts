import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import Federation from "../../models/Federation";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../../Utils";
import Administrator from "../../models/Administrator";
import League from "../../models/League";
import Championship from "../../models/Championship";

@Controller("/my/federation")
@Authenticate()
export class MyFederationController {

  /**
   * GET all accessible federations
   * @param request
   */
  @Get("/")
  @ContentType("json")
  async getAll(@Req() request: Req) {
    const perms = await Utils.getAccessibleFederationRessources(<Administrator>request.user);

    const result = await DB.query(`SELECT f.*, row_to_json(s.*) as sport
                                   FROM federation f
                                            INNER JOIN sport s ON s.id = f.sportid
                                   WHERE f.id = ANY ($1)`, [perms]);
    return result.rows.map(r => Federation.hydrate<Federation>(r));
  }

  /**
   * PUT Insert a new federation
   * @param federation
   */
  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() federation: Federation) {
    const result = await DB.query(`INSERT INTO federation (name, sportid)
                                   VALUES ($1, $2)
                                   RETURNING *`,
      [federation.name, federation.sport.id]
    );

    // TODO: transaction pour create + ajout dans admin_federation

    return result.rows.map((r) => Federation.hydrate<Federation>(r))[0];
  }

  /**
   * PATCH Update a federation
   * @param request
   * @param id
   * @param federation
   */
  @Patch("/:id")
  @ContentType("json")
  async update(@Req() request: Req, @PathParams("id") id: number, @BodyParams() federation: Federation) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`UPDATE federation
                                   SET name = $1
                                   WHERE id = $2
                                   RETURNING *`, [federation.name, id]);

    return result.rows.map((r) => Federation.hydrate<Federation>(r))[0];
  }

  /**
   * DELETE a federation
   * @param request
   * @param id
   */
  @Delete("/:id")
  @ContentType("json")
  async delete(@Req() request: Req, @PathParams("id") id: number) {
    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`DELETE
                    FROM federation
                    WHERE id = $1`, [id]);
  }

  /**
   * SECTION LEAGUE
   */

  /**
   * GET all league of federation
   * @param request
   * @param id
   */
  @Get("/:id/league")
  @ContentType("json")
  async getAllLeagues(@Req() request: Req, @PathParams("id") id: number) {
    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`SELECT *
                                   FROM league
                                   WHERE federationid = $1`, [id]);

    return result.rows.map(r => League.hydrate<League>(r));
  }

  /**
   * PUT insert league in federation
   * @param request
   * @param league
   * @param id
   */
  @Put("/:id/league")
  @ContentType("json")
  async insertLeague(@Req() request: Req, @BodyParams() league: League, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");
    const client = await PoolClient();

    try {
      await client.query("BEGIN");

      const res = await client.query(`INSERT INTO league (level, gender, federationid)
                                      VALUES ($1, $2, $3)
                                      RETURNING *`, [league.level, league.gender, id]);

      await client.query("COMMIT");

      return res.rows.map(r => League.hydrate<League>(r))[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  /**
   * PATCH update league
   *
   * @param request
   * @param id
   * @param league
   */
  @Patch("/:id/league")
  @ContentType("json")
  async updateLeague(@Req() request: Req, @BodyParams() league: League, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

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
  @Delete("/:id/league")
  @ContentType("json")
  async deleteLeague(@Req() request: Req, @PathParams("id") id: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`DELETE
                    FROM league
                    WHERE id = $1`, [id]);
  }

  /**
   * SECTION CHAMPIONSHIP
   */

  /**
   * GET all championship of leagues
   * @param request
   * @param id
   * @param lid
   * @param query
   * @param limit
   * @param offset
   */
  @Get("/:id/league/:lid/championship")
  @ContentType("json")
  async getAllLeagueChampionships(@Req() request: Req,
                                  @PathParams("id") id: number,
                                  @PathParams("lid") lid: number,
                                  @QueryParams("q") query: string = "",
                                  @QueryParams("limit") limit: number = 20,
                                  @QueryParams("offset") offset: number = 0) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`SELECT *
                                   FROM championship
                                   WHERE leagueid = $1`, [lid]);

    return result.rows.map(r => Championship.hydrate<Championship>(r));

    // return Utils.createSimpleSearchPaginate(Championship, "championship", ["name"], query, limit, offset);
  }

  /**
   * PUT create new championship in league
   * @param request
   * @param championship
   * @param id
   * @param lid
   */
  @Put("/:id/league/:lid/championship")
  @ContentType("json")
  async insertChampionship(@Req() request: Req,
                           @BodyParams() championship: Championship,
                           @PathParams("id") id: number,
                           @PathParams("lid") lid: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`INSERT INTO championship (name, startat, endat, seasonid, leagueid)
                                   VALUES ($1, $2, $3, $4, $5)
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, championship.season.id, lid]);

    return result.rows.map(r => Championship.hydrate<Championship>(r))[0];
  }

  /**
   * PATCH update championship
   * @param request
   * @param championship
   * @param id
   * @param cid
   */
  @Patch("/:id/league/:lid/championship/:cid")
  @ContentType("json")
  async updateChampionship(@Req() request: Req,
                           @BodyParams() championship: Championship,
                           @PathParams("id") id: number,
                           @PathParams("cid") cid: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`UPDATE championship
                                   SET name     = $1,
                                       startat  = $2,
                                       endat    = $3,
                                       seasonid = $4
                                   WHERE id = $5
                                   RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, championship.season.id, cid]
    );

    return result.rows.map(r => Championship.hydrate<Championship>(r))[0];
  }

  /**
   * DELETE championship
   * @param request
   * @param id
   * @param cid
   */
  @Delete("/:id/league/:lid/championship/:cid")
  @ContentType("json")
  async deleteChampionship(@Req() request: Req,
                           @PathParams("id") id: number,
                           @PathParams("cid") cid: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`DELETE
                    FROM championship
                    WHERE id = $1`, [cid]);
  }


}
