import {BodyParams, Controller, Get, Put, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import CalendarEntry from "../../models/CalendarEntry";
import Training from "../../models/Training";

@Controller("/event")
@Authenticate()
export class MyEventController {
  @Get("/")
  @ContentType("json")
  async get() {
    const result = await DB.query(`SELECT *
                                   FROM event`);
    return result.rows;
  }

  @Get("/calendar")
  @ContentType("json")
  async getCalendar(@Req() request: Req, @QueryParams("start") start: string, @QueryParams("end") end: string) {
    const perms = [
      ...await Utils.getAccessibleTrainingResources(<Administrator>request.user),
      ...await Utils.getAccessibleGameResources(<Administrator>request.user)
    ];

    const result = await DB.query(`SELECT *
                                   FROM event_list
                                   WHERE startat BETWEEN $1 AND $2
                                     AND endat BETWEEN $1 AND $2
                                     AND uid = ANY ($3) `,
      [start, end, perms]);

    return result.rows.map(r => CalendarEntry.hydrate<CalendarEntry>(r));
  }

  @Put("/game")
  @ContentType("json")
  async putGame(@Req() request: Req, @BodyParams() game: Game) {
    if (!await Utils.checkAccessToChampionshipResource(<Administrator>request.user, game.championship.id)) throw new Unauthorized("Unauthorized Resource");

    const client = await PoolClient();
    try {
      await client.query("BEGIN");
      const res1 = await client.query(
        `INSERT INTO event (name, startat, endat, stadiumid)
         VALUES ($1, $2, $3, $4)
         RETURNING *`, [game.name, game.startAt, game.endAt, game.stadium.id]);

      const res2 = await client.query(`INSERT INTO game (eventuid, gameid, championshipid, teamhomeid, teamguestid)
                                       VALUES ($1, $2, $3, $4, $5)`, [res1.rows[0].uid, game.gameId, game.championship.id, game.teamHome.id, game.teamGuest.id]);

      await client.query("COMMIT");

      return res2.rows.map(r => Game.hydrate<Game>(r))[0];

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Put("/training")
  @ContentType("json")
  async putTraining(@Req() request: Req, @BodyParams() training: Training) {
    if (!await Utils.checkAccessToTeamResource(<Administrator>request.user, training.team.id)) throw new Unauthorized("Unauthorized Resource");

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
}

