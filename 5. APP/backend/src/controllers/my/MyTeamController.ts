import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Federation from "../../models/Federation";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../../Utils";
import Administrator from "../../models/Administrator";
import Team from "../../models/Team";
import PlayerTeam from "../../models/PlayerTeam";

@Controller("/my/team")
@Authenticate()
export class MyTeamController {

  @Get("/")
  @ContentType("json")
  async getAll(@Req() request: Req) {

    const perms = Utils.getAccessibleClubRessources(<Administrator>request.user);

    const result = await DB.query(`SELECT t.*, row_to_json(c.*) as club, row_to_json(l.*) as league
                                   FROM team t
                                            INNER JOIN club c on t.clubid = c.id
                                            INNER JOIN league l on t.leagueid = l.id
                                   WHERE c.id = ANY ($1)`, [perms]);
    return result.rows.map(r => Team.hydrate<Team>(r));
  }

  @Get("/:id/player")
  @ContentType("json")
  async getPlayers(@Req() request: Req, @PathParams("id") id: number) {

    const perms = Utils.getAccessibleClubRessources(<Administrator>request.user);

    const result = await DB.query(`SELECT *
                                   FROM player
                                            INNER JOIN player_play_for_team ppft ON player.uid = ppft.playeruid
                                            INNER JOIN team t ON ppft.teamid = t.id
                                            INNER JOIN club c on t.clubid = c.id
                                   WHERE t.id = $1 AND c.id = ANY ($2)
                                     AND (endat IS NULL OR endat > NOW());`, [id, perms]);

    return result.rows.map(r => PlayerTeam.hydrate<PlayerTeam>(r));
  }

  @Put("/")
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() team: Team) {

    if (!await Utils.checkAccessToClubRessource(<Administrator>request.user, team.club.id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`INSERT INTO team(name, clubid, leagueid)
                                   VALUES ($1, $2, $3)
                                   RETURNING *`, [team.name, team.club.id, team.league.id]);

    return result.rows.map((r) => Team.hydrate<Team>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("id") id: number, @BodyParams() team: Team) {
    if (!await Utils.checkAccessToClubRessource(<Administrator>request.user, team.club.id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`UPDATE team
                                   SET name     = $1,
                                       clubid   = $2,
                                       leagueid = $3
                                   WHERE id = $4
                                   RETURNING *`, [team.name, team.club.id, team.league.id, id]);

    return result.rows.map((r) => Team.hydrate<Team>(r))[0];
  }

  @Put("/:id/player")
  @ContentType("json")
  async addPlayer(@Req() request: Req, @PathParams("id") id: number, @BodyParams() data: any) {

    if (!await Utils.checkAccessToTeamRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`INSERT INTO player_play_for_team(playeruid, teamid, jerseynumber)
                    VALUES ($1, $2, $3)`, [data.playerUid, id, data.jerseyNumber]);
  }

  @Patch("/:id/player")
  @ContentType("json")
  async updatePlayer(@Req() request: Req, @PathParams("id") id: number, @BodyParams() data: any) {

    if (!await Utils.checkAccessToTeamRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`UPDATE player_play_for_team
                    SET jerseynumber = $1
                    WHERE playeruid = $2
                      AND teamid = $3 `, [data.jerseyNumber, data.playerUid, id]);
  }


  @Delete("/:id/player")
  @ContentType("json")
  async deletePlayer(@Req() request: Req, @PathParams("id") id: number, @BodyParams() data: any) {

    if (!await Utils.checkAccessToTeamRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    await DB.query(`UPDATE player_play_for_team
                    SET endat        = current_timestamp,
                        jerseynumber = NULL
                    WHERE playeruid = $1
                      AND teamid = $2 `, [data.playerUid, id]);
  }
}
