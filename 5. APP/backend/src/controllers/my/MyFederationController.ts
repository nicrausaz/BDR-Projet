import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import Federation from "../../models/Federation";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/federation")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyFederationController {

  @Get("/")
  @ContentType("json")
  async getAll(@Req() request: Req) {
    const perms = await Utils.getAccessibleFederationResources(<Administrator>request.user);

    const result = await DB.query(`SELECT f.*, row_to_json(s.*) as sport
                                   FROM federation f
                                            INNER JOIN sport s ON s.id = f.sportid
                                   WHERE f.id = ANY ($1) AND f.active = TRUE`, [perms]);
    return result.rows.map(r => Federation.hydrate<Federation>(r));
  }

  @Put("/")
  @ContentType("json")
  async insert(@Req() request: Req, @BodyParams() federation: Federation) {

    const client = await PoolClient();

    try {
      await client.query("BEGIN");

      const res1 = await client.query(`INSERT INTO federation (name, sportid)
                                       VALUES ($1, $2)
                                       RETURNING *`, [federation.name, federation.sport.id]);

      const res2 = await client.query(`INSERT INTO administrator_federation (administratoruid, federationid)
                                       VALUES ($1, $2)`, [(<Administrator>request.user).uid, res1.rows[0].id]);

      await client.query("COMMIT");

      return res1.rows.map((r) => Federation.hydrate<Federation>(r))[0];

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Patch("/:id")
  @ContentType("json")
  async update(@Req() request: Req, @PathParams("id") id: number, @BodyParams() federation: Federation) {

    if (!await Utils.checkAccessToFederationResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(`UPDATE federation
                                   SET name = $1
                                   WHERE id = $2
                                   RETURNING *`, [federation.name, id]);

    return result.rows.map((r) => Federation.hydrate<Federation>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(@Req() request: Req, @PathParams("id") id: number) {
    if (!await Utils.checkAccessToFederationResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const client = await PoolClient();

    try {
      await client.query("BEGIN");

      const res1 = await client.query(`UPDATE federation
                                       SET active = FALSE
                                       WHERE id = $1
                                       RETURNING id`, [id]);

      await client.query(`UPDATE league
                          SET active = FALSE
                          WHERE federationid = $1`, [res1.rows[0].id]);

      await client.query(`UPDATE championship
                          SET active = FALSE
                          WHERE leagueid = $1`, [res1.rows[0].id]);

      await client.query("COMMIT");

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
}
