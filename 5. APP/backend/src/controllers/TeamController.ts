import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Team from "../models/Team";
import {NotFound} from "@tsed/exceptions";
import PlayerTeam from "../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";

@Controller("/team")
@Authenticate()
export class TeamController {

  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(`SELECT *
                                   FROM team`);
    return result.rows.map(r => Team.hydrate<Team>(r));
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

  @Put("/")
  @ContentType("json")
  async put(@BodyParams() team: Team) {
    const result = await DB.query(`INSERT INTO team(name, clubid, leagueid)
                                   VALUES ($1, $2, $3)
                                   RETURNING *`, [team.name, team.club.id, team.league.id]);

    return result.rows.map((r) => Team.hydrate<Team>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(
    @PathParams("id") id: number,
    @BodyParams() team: Team) {
    const result = await DB.query(`UPDATE team
                                   SET name     = $1,
                                       clubid   = $2,
                                       leagueid = $3
                                   WHERE id = $4
                                   RETURNING *`, [team.name, team.club.id, team.league.id, id]);

    return result.rows.map((r) => Team.hydrate<Team>(r))[0];
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

  @Put("/:id/player")
  @ContentType("json")
  async addPlayer(
    @PathParams("id") id: number,
    @BodyParams() data: any
  ) {
    await DB.query(`INSERT INTO player_play_for_team(playeruid, teamid, jerseynumber)
                    VALUES ($1, $2, $3)`, [data.playerUid, id, data.jerseyNumber]);
  }

  @Patch("/:id/player")
  @ContentType("json")
  async updatePlayer(
    @PathParams("id") id: number,
    @BodyParams() data: any
  ) {
    await DB.query(`UPDATE player_play_for_team
                    SET jerseynumber = $1
                    WHERE playeruid = $2
                      AND teamid = $3 `, [data.jerseyNumber, data.playerUid, id]);
  }


  @Delete("/:id/player")
  @ContentType("json")
  async deletePlayer(
    @PathParams("id") id: number,
    @BodyParams() data: any
  ) {
    await DB.query(`UPDATE player_play_for_team
                    SET endat        = current_timestamp,
                        jerseynumber = NULL
                    WHERE playeruid = $1
                      AND teamid = $2 `, [data.playerUid, id]);
  }
}
