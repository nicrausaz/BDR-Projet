import {BodyParams, Controller, Get, Put, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import CalendarEntry from "../../models/CalendarEntry";

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
  async getCalendar(@Req() request: Req, @QueryParams('start') start: string, @QueryParams('end') end: string) {

    console.log(start, end);
    const result = await DB.query(`SELECT *
                                   FROM event
                                   WHERE startat BETWEEN $1 AND $2
                                     AND endat BETWEEN $1 AND $2`,
      [start, end]);

    return result.rows.map(r => CalendarEntry.hydrate<CalendarEntry>(r));
  }

  @Put("/game")
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() game: Game) {
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
}

