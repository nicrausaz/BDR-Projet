import {Controller, Get, PathParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import {NotFound} from "@tsed/exceptions";
import Game from "../models/Game";
import {Authenticate} from "@tsed/passport";

@Controller("/game")
@Authenticate()
export class GameController {
  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(
      `SELECT g.*, row_to_json(s.*) as stadium, row_to_json(th.*) as teamHome, row_to_json(tg.*) as teamGuest
       FROM event_game g
                INNER JOIN stadium s ON s.id = g.stadiumid
                INNER JOIN team th ON th.id = g.teamhomeid
                INNER JOIN team tg ON tg.id = g.teamguestid`);
    return result.rows.map(r => Game.hydrate<Game>(r));
  }

  @Get("/:uid")
  @ContentType("json")
  async get(
    @PathParams("uid") uid: string
  ) {
    const query = await DB.query(
      `SELECT g.*, row_to_json(s.*) as stadium, row_to_json(th.*) as teamHome, row_to_json(tg.*) as teamGuest
       FROM event_game g
                INNER JOIN stadium s ON s.id = g.stadiumid
                INNER JOIN team th ON th.id = g.teamhomeid
                INNER JOIN team tg ON tg.id = g.teamguestid
       WHERE g.uid = $1`, [uid]);
    const result = query.rows.map(r => Game.hydrate<Game>(r))[0];
    if (result) return result;
    throw new NotFound("Game not found");
  }
}

