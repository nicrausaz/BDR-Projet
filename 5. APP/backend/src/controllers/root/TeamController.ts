import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Team from "../../models/Team";
import {NotFound} from "@tsed/exceptions";
import PlayerTeam from "../../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import {Readable} from "stream";
import Paginator from "../../utils/Paginator";

/**
 * Public team endpoint
 */
@Controller("/team")
@UseBefore(RouteLogMiddleware)
export class TeamController {

  /**
   * Retrive all teams
   * @param query 
   * @param limit 
   * @param offset 
   */
  @Get("/")
  @ContentType("json")
  @Authenticate()
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return new Paginator(Team)
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

  /**
   * Retrieve a team
   * @param id
   */
  @Get("/:id")
  @ContentType("json")
  @Authenticate()
  async get(@PathParams("id") id: number) {
    const query = await DB.query(`SELECT *
                                  FROM team
                                  WHERE id = $1
                                    AND active = TRUE`, [id]);
    const result = query.rows.map(r => Team.hydrate<Team>(r))[0];
    if (result) return result;
    throw new NotFound("Team not found");
  }

  /**
   * Retrieve team's players
   * @param id
   */
  @Get("/:id/player")
  @ContentType("json")
  @Authenticate()
  async getPlayers(@PathParams("id") id: number) {

    const result = await DB.query(`SELECT *
                                   FROM player
                                            INNER JOIN player_play_for_team ppft ON player.uid = ppft.playeruid
                                            INNER JOIN team t ON ppft.teamid = t.id
                                   WHERE t.id = $1
                                     AND (endat IS NULL OR endat > NOW());`, [id]);

    return result.rows.map(r => PlayerTeam.hydrate<PlayerTeam>(r));
  }

  /**
   * Retrieve team's games
   * @param id
   */
  @Get("/:id/games")
  @ContentType("json")
  @Authenticate()
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

  /**
   * Retrieve team's stats (Wins, draws, looses)
   * @param id
   */
  @Get("/:id/stats")
  @ContentType("json")
  @Authenticate()
  async getStats(@PathParams("id") id: number) {
    const result = await DB.query(`SELECT SUM(CASE WHEN result = 'W' then 1 else 0 end) AS wins,
                                          SUM(CASE WHEN result = 'D' then 1 else 0 end) AS draws,
                                          SUM(CASE WHEN result = 'L' then 1 else 0 end) AS loses

                                   FROM team_played_games
                                   WHERE teamid = $1
                                   GROUP BY teamid;`, [id]);

    return result.rowCount != 0 ? result.rows[0] : {};
  }

  /**
   * Retrieve team's picture
   * @param id
   * @private
   */
  @Get("/:id/avatar")
  @ContentType(Jimp.MIME_PNG)
  private async avatar(
    @PathParams("id") id: number
  ) {
    const path = `${rootDir}/storage/team/${id}.png`;
    return Readable.from(await (await Jimp.read(path)
      .catch(() => Jimp.read(`https://i.pravatar.cc/250?u=${id}`)))
      .contain(500, 500)
      .quality(50)
      .getBufferAsync(Jimp.MIME_PNG));
  }
}
