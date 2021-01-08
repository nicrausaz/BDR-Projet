import {Controller, Get, PathParams, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import Game from "../../models/Game";
import {Authenticate} from "@tsed/passport";
import Paginator from "../../utils/Paginator";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";

@Controller("/game")
@Authenticate()
export class MyGameController {
  @Get("/")
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const perms = await Utils.getAccessibleGameResources(<Administrator>request.user);
    return new Paginator(Game)
      .setTotalQuery(`
          SELECT count(*)
          FROM event_game
          WHERE uid = ANY ($1)
            AND name ILIKE $2
      `, [perms])
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
          WHERE g.uid = ANY ($1)
            AND g.name ILIKE $2
          ORDER BY g.startat DESC
      `, [perms])
      .create({query, limit, offset});
  }

  @Get("/:uid")
  @ContentType("json")
  async get(
    @Req() request: Req,
    @PathParams("uid") uid: string
  ) {
    if (!await Utils.checkAccessToGameResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized ressource");

    const query = await DB.query(`
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
        WHERE g.uid = $1
    `, [uid]);

    const result = query.rows.map(r => Game.hydrate<Game>(r))[0];
    if (result) return result;
    throw new NotFound("Game not found");
  }
}

