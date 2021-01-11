import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import Training from "../../models/Training";
import {Authenticate} from "@tsed/passport";
import Paginator from "../../utils/Paginator";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/training")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyTrainingController {
  @Get("/")
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const perms = await Utils.getAccessibleTrainingResources(<Administrator>request.user);
    return new Paginator(Training)
      .setTotalQuery(`
          SELECT count(*)
          FROM event_training
          WHERE uid = ANY ($1)
            AND name ILIKE $2
      `, [perms])
      .setQuery(`
          SELECT t.*, row_to_json(s.*) as stadium, row_to_json(team.*) as team
          FROM event_training t
                   INNER JOIN stadium s ON s.id = t.stadiumid
                   INNER JOIN team ON team.id = t.teamid
          WHERE t.uid = ANY ($1)
            AND t.name ILIKE $2
          ORDER BY t.startat DESC
      `, [perms])
      .create({query, limit, offset});
  }

  @Get("/:uid")
  @ContentType("json")
  async get(
    @Req() request: Req,
    @PathParams("uid") uid: string
  ) {
    if (!await Utils.checkAccessToTrainingResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized ressource");

    const query = await DB.query(`
        SELECT t.*, row_to_json(s.*) as stadium, row_to_json(th.*) as team
        FROM event_training t
                 INNER JOIN stadium s ON s.id = t.stadiumid
                 INNER JOIN team th ON th.id = t.teamid
        WHERE t.uid = $1
    `, [uid]);

    const result = query.rows.map(r => Training.hydrate<Training>(r))[0];
    if (result) return result;
    throw new NotFound("Training not found");
  }

  @Put("/")
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() training: Training) {
    if (!await Utils.checkAccessToTeamResource(<Administrator>request.user, training.team.id)) throw new Unauthorized("Unauthorized Resource");

    console.log(training);
    const client = await PoolClient();
    try {
      await client.query("BEGIN");
      const res1 = await client.query(
          `INSERT INTO event (name, startat, endat, stadiumid)
           VALUES ($1, $2, $3, $4)
           RETURNING *`, [training.name, training.startAt, training.endAt, training.stadium.id]);

      const res2 = await client.query(`INSERT INTO training (eventuid, description, teamid)
                                       VALUES ($1, $2, $3)`, [res1.rows[0].uid, training.description, training.team.id]);

      await client.query("COMMIT");

      return res2.rows.map(r => Training.hydrate<Training>(r))[0];

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }


  @Patch("/:uid")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("uid") uid: string, @BodyParams() training: Training) {
    if (!await Utils.checkAccessToTrainingResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized ressource");
    if (!await Utils.checkAccessToTeamResource(<Administrator>request.user, training.team.id)) throw new Unauthorized("Unauthorized ressource");

    const client = await PoolClient();
    try {
      await client.query("BEGIN");
      const res1 = await client.query(
          `UPDATE event
           SET name      = $1,
               startat   = $2,
               endat     = $3,
               stadiumid = $4
           WHERE uid = $5
           RETURNING *`, [training.name, training.startAt, training.endAt, training.stadium.id, uid]);

      const res2 = await client.query(`UPDATE training
                                       SET description = $1,
                                           teamid      = $2
                                       WHERE eventuid = $3
                                       RETURNING *`, [training.description, training.team.id, res1.rows[0].uid]);

      await client.query("COMMIT");

      return res2.rows.map(r => Training.hydrate<Training>(r))[0];

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Delete("/:uid")
  @ContentType("json")
  async delete(@Req() request: Req, @PathParams("uid") uid: string) {
    if (!await Utils.checkAccessToTrainingResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`DELETE FROM event WHERE uid = $1`, [uid]);
  }
}

