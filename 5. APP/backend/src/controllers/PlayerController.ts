import {BodyParams, Controller, Get, Patch, PathParams, Put, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Player from "../models/player";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import PlayerTeam from "../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";
import {Utils} from "./utils";
import Administrator from "../models/Administrator";

@Controller("/player")
@Authenticate()
export class PlayerController {
  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(`SELECT *
                                   FROM player`);
    return result.rows.map(r => Player.hydrate<Player>(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: string) {
    const query = await DB.query(`SELECT *
                                  FROM player
                                  WHERE uid = $1`, [id]);
    const result = query.rows.map(r => Player.hydrate<Player>(r))[0];
    if (result) return result;
    throw new NotFound("Player not found");
  }

  @Put()
  @ContentType("json")
  async put(@BodyParams() player: Player) {
    const result = await DB.query(`INSERT INTO player(lastname, firstname, birthdate, height, weight, sex)
                                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex]);

    return result.rows.map((r) => Player.hydrate<Player>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("id") id: string, @BodyParams() player: Player) {

    if (!await Utils.checkAccessToPlayerRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`UPDATE player
                                   SET lastname  = $1,
                                       firstname = $2,
                                       birthdate = $3,
                                       height    = $4,
                                       weight    = $5,
                                       sex       = $6
                                   WHERE uid = $7 RETURNING *`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex, id]);

    return result.rows.map((r) => Player.hydrate<Player>(r))[0];
  }

  @Get("/:id/teams")
  @ContentType("json")
  async getTeams(@PathParams("id") id: string) {
    const result = await DB.query(`SELECT ppft.*,
                                          row_to_json(t.*) as team,
                                          row_to_json(c.*) as club,
                                          row_to_json(l.*) as league
                                   FROM player_play_for_team ppft
                                            INNER JOIN team t on ppft.teamid = t.id
                                            INNER JOIN club c on t.clubid = c.id
                                            INNER JOIN league l on t.leagueid = l.id
                                   WHERE ppft.playeruid = $1`, [id]);

    return result.rows.map(r => PlayerTeam.hydrate<PlayerTeam>(r));
  }
}
