import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Team from "../models/Team";
import {NotFound} from "@tsed/exceptions";
import PlayerTeam from "../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";
import {Utils} from "./utils";

@Controller("/team")
@Authenticate()
export class TeamController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return Utils.createSearchPaginate(Team, "team", `
        SELECT t.*, row_to_json(c.*) as club, row_to_json(l.*) as league
        FROM team t
                 INNER JOIN club c on t.clubid = c.id
                 INNER JOIN league l on t.leagueid = l.id
        WHERE t.name ILIKE $1
    `, [], query, limit, offset);
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
}
