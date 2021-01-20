import {Controller, Get, PathParams, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType, Returns} from "@tsed/schema";
import DB from "../../db/DB";
import Championship from "../../models/Championship";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";
import Game from "../../models/Game";

/**
 * Public championship endpoint
 */
@Controller("/championship")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class ChampionshipController {

  /**
   * Retrieve all championships
   * @param query
   * @param limit
   * @param offset
   */
  @Get("/")
  @(Returns(200, Championship).Of(Championship).Description("All Championship"))
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0) {
    const page = new Paginator(Championship)
      .setTotalQuery(`
          SELECT count(*)
          FROM championship
          WHERE name ILIKE $1
            AND active = TRUE
      `)
      .setQuery(`
          SELECT c.*, row_to_json(l.*) as league
          FROM championship as c
                   INNER JOIN league l on l.id = c.leagueid
          WHERE c.name ILIKE $1
            AND c.active = TRUE
          ORDER BY c.name
      `)
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  /**
   * Retrieve a championship
   * @param id
   */
  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: string) {
    const query = await DB.query(
      `SELECT *, row_to_json(l.*) as league
       FROM championship c
                INNER JOIN league l on c.leagueid = l.id AND l.active = TRUE
       WHERE c.id = $1
         AND c.active = TRUE`
      , [id]);

    const result = query.rows.map(r => Championship.hydrate<Championship>(r))[0];
    if (result) return result;
    throw new NotFound("Championship not found");
  }

  /**
   * Retrieve games of championship
   * @param id
   */
  @Get("/:id/games")
  @ContentType("json")
  async getGames(@PathParams("id") id: string) {
    const query = await DB.query(`SELECT g.*,
                                         row_to_json(s.*)  as stadium,
                                         row_to_json(th.*) as teamHome,
                                         row_to_json(tg.*) as teamGuest,
                                         row_to_json(c.*)  as championship
                                  FROM event_game g
                                           INNER JOIN stadium s
                                                      ON s.id = g.stadiumid
                                           INNER JOIN team th ON th.id = g.teamhomeid
                                           INNER JOIN team tg ON tg.id = g.teamguestid
                                           INNER JOIN championship c ON c.id = g.championshipid
                                  WHERE championshipid = $1`, [id]);

    return query.rows.map(r => Game.hydrate<Game>(r));
  }
}

