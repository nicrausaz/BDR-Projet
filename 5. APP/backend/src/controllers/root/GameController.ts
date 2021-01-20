import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {NotFound} from "@tsed/exceptions";
import Game from "../../models/Game";
import {Authenticate} from "@tsed/passport";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

/**
 * Public game endpoint
 */
@Controller("/game")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class GameController {
  /**
   * Retrive all games
   * @param query
   * @param limit
   * @param offset
   */
  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return new Paginator(Game)
      .setTotalQuery(`
          SELECT count(*)
          FROM event_game
          WHERE name ILIKE $1
      `)
      .setQuery(`
          SELECT g.*,
                 row_to_json(s.*)  as stadium,
                 row_to_json(th.*) as teamHome,
                 row_to_json(tg.*) as teamGuest,
                 row_to_json(c.*)  as championship
          FROM event_game g
                   INNER JOIN stadium s ON s.id = g.stadiumid
                   INNER JOIN team th ON th.id = g.teamhomeid
                   INNER JOIN team tg ON tg.id = g.teamguestid
                   INNER JOIN championship c ON c.id = g.championshipid
          WHERE g.name ILIKE $1
          ORDER BY g.startat DESC
      `)
      .create({query, limit, offset});
  }

  /**
   * Retrieve a game
   * @param uid
   */
  @Get("/:uid")
  @ContentType("json")
  async get(@PathParams("uid") uid: string) {
    const query = await DB.query(
      `SELECT g.*,
              row_to_json(s.*)  as stadium,
              row_to_json(th.*) as teamHome,
              row_to_json(tg.*) as teamGuest,
              row_to_json(c.*)  as championship
       FROM event_game g
                INNER JOIN stadium s ON s.id = g.stadiumid
                INNER JOIN team th ON th.id = g.teamhomeid
                INNER JOIN team tg ON tg.id = g.teamguestid
                INNER JOIN championship c ON c.id = g.championshipid
       WHERE g.uid = $1`, [uid]);
    const result = query.rows.map(r => Game.hydrate<Game>(r))[0];
    if (result) return result;
    throw new NotFound("Game not found");
  }
}

