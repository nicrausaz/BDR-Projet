import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Federation from "../../models/Federation";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../utils";
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

    const result = await DB.query(`INSERT INTO league (level, gender, federationid)
                                   VALUES ($1, $2, $3)
                                   RETURNING *`, [league.level, league.gender, league.federation.id]);

    return result.rows.map((r) => League.hydrate<League>(r))[0];
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
   */
  @Get("/:id/league/:lid/championship")
  @ContentType("json")
  async getAllLeagueChampionships(@Req() request: Req, @PathParams("id") id: number, @PathParams("lid") lid: number) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");


    const result = await DB.query(`SELECT *
                                   FROM championship
                                   WHERE leagueid = $1`, [lid]);

    return result.rows.map(r => Championship.hydrate<Championship>(r));
  }
}
