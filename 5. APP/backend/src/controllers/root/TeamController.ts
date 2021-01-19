import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Team from "../../models/Team";
import {NotFound} from "@tsed/exceptions";
import PlayerTeam from "../../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";
import Championship from "../../models/Championship";

@Controller("/team")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class TeamController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return new Paginator(Championship)
      .setTotalQuery(`
          SELECT count(*)
          FROM team
          WHERE name ILIKE $1 AND active = TRUE
      `)
      .setQuery(`
          SELECT t.*, row_to_json(c.*) as club, row_to_json(l.*) as league
          FROM team t
                   INNER JOIN club c on t.clubid = c.id
                   INNER JOIN league l on t.leagueid = l.id
          WHERE t.name ILIKE $1 AND t.active = TRUE
      `,)
      .create({query, limit, offset});
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(`SELECT *
                                  FROM team
                                  WHERE id = $1`, [id]);
    const result = query.rows.map(r => Team.hydrate<Team>(r))[0];
    if (result) return result;
    throw new NotFound("Team not found");
  }

  @Get("/:id/player")
  @ContentType("json")
  async getPlayers(@PathParams("id") id: number) {

    const result = await DB.query(`SELECT *
                                   FROM player
                                            INNER JOIN player_play_for_team ppft ON player.uid = ppft.playeruid
                                            INNER JOIN team t ON ppft.teamid = t.id
                                   WHERE t.id = $1
                                     AND (endat IS NULL OR endat > NOW());`, [id]);

    return result.rows.map(r => PlayerTeam.hydrate<PlayerTeam>(r));
  }

  @Get("/:id/games")
  @ContentType("json")
  async getGames(@PathParams("id") id: number) {
    const result = await DB.query(`SELECT e.uid,
                                          e.name,
                                          e.startat,
                                          e.endat,
                                          createdat,
                                          updatedat,
                                          stadiumid,
                                          gameid,
                                          scorehome,
                                          scoreguest,
                                          teamhomeid,
                                          teamguestid

                                   FROM event e
                                            INNER JOIN game g ON e.uid = g.eventuid
                                            INNER JOIN championship c ON g.championshipid = c.id
                                            INNER JOIN team t1 ON g.teamhomeid = t1.id
                                            INNER JOIN team t2 ON g.teamguestid = t2.id
                                   WHERE teamguestid = $1
                                      OR teamhomeid = $1`, [id]);

    return result.rows.map(r => Game.hydrate<Game>(r));
  }

  @Get("/:id/stats")
  @ContentType("json")
  async getStats(@PathParams("id") id: number) {
    const result = await DB.query(`SELECT SUM(CASE WHEN result = 'W' then 1 else 0 end) AS wins,
                                          SUM(CASE WHEN result = 'D' then 1 else 0 end) AS draws,
                                          SUM(CASE WHEN result = 'L' then 1 else 0 end) AS loses

                                   FROM team_played_games
                                   WHERE teamid = $1
                                   GROUP BY teamid;`, [id]);

    return result.rowCount != 0 ? result.rows[0] : {};
  }
}
