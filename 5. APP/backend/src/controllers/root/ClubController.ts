import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Club from "../../models/Club";
import Team from "../../models/Team";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Paginator from "../../utils/Paginator";

@Controller("/club")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class ClubController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const page = new Paginator(Club)
      .setTotalQuery(`
          SELECT count(*)
          FROM club
          WHERE name ILIKE $1
            AND active = TRUE
      `)
      .setQuery(`
          SELECT c.*
          FROM club c
          WHERE c.name ILIKE $1
            AND c.active = TRUE
          ORDER BY c.name
      `)
      .create({query, limit, offset});
    return JSON.stringify(await page);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(
        `SELECT c.*, row_to_json(s.*) as sport
         FROM club c
                  INNER JOIN sport s ON s.id = c.sportid
         WHERE c.id = $1`, [id]);
    const result = query.rows.map(r => Club.hydrate<Club>(r))[0];
    if (result) return result;
    throw new NotFound("Club not found");
  }

  @Get("/:id/teams")
  @ContentType("json")
  async getTeams(@PathParams("id") id: number) {
    const result = await DB.query(
        `SELECT t.*
         FROM club c
                  INNER JOIN team t ON c.id = t.clubid
         WHERE c.id = $1`, [id]);
    return result.rows.map(r => Team.hydrate<Team>(r));
  }
}
