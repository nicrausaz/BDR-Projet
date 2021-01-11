import {BodyParams, Controller, Get, Patch, PathParams, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import Club from "../../models/Club";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/club")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyClubController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0) {
    const perms = await Utils.getAccessibleClubResources(<Administrator>request.user);

    return new Paginator(Club)
      .setTotalQuery(`
          SELECT count(*)
          FROM club c
                   INNER JOIN sport s ON s.id = c.sportid
          WHERE c.id = ANY ($1)
            AND c.name ILIKE $2
      `, [perms])
      .setQuery(`SELECT c.*, row_to_json(s.*) as sport
                 FROM club c
                          INNER JOIN sport s ON s.id = c.sportid
                 WHERE c.id = ANY ($1)
                   AND c.name ILIKE $2
                 ORDER BY name
      `, [perms])
      .create({query, limit, offset});
  }

  @Put("/")
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() club: Club) {
    const client = await PoolClient();
    try {
      await client.query("BEGIN");

      const res1 = await client.query(
        `INSERT INTO club (name, sportid)
           VALUES ($1, $2)
           RETURNING *`, [club.name, club.sport.id]);

      const res2 = await client.query(`INSERT INTO administrator_club (administratoruid, clubid)
                                       VALUES ($1, $2)`, [(<Administrator>request.user).uid, res1.rows[0].id]);

      await client.query("COMMIT");

      return res1.rows.map(r => Club.hydrate<Club>(r))[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("id") id: number, @BodyParams() club: Club) {
    if (!await Utils.checkAccessToClubResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(
      `UPDATE club
         SET name    = $1,
             sportid = $2
         WHERE id = $3
         RETURNING *`, [club.name, club.sport.id, id]);

    return result.rows.map(r => Club.hydrate<Club>(r))[0];
  }
}
