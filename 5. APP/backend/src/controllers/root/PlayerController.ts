import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Player from "../../models/Player";
import {NotFound} from "@tsed/exceptions";
import PlayerTeam from "../../models/PlayerTeam";
import {Authenticate} from "@tsed/passport";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import {Readable} from "stream";
import Paginator from "../../utils/Paginator";

@Controller("/player")
export class PlayerController {
  @Get("/")
  @ContentType("json")
  @Authenticate()
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return new Paginator(Player)
      .setTotalQuery(`
          SELECT count(*)
          FROM player
          WHERE (firstname ILIKE $1 OR lastname ILIKE $1)
      `)
      .setQuery(`
          SELECT *
          FROM player
          WHERE (firstname ILIKE $1 OR lastname ILIKE $1)
          ORDER BY firstname, lastname
      `)
      .create({query, limit, offset});
  }

  @Get("/:uid")
  @ContentType("json")
  @Authenticate()
  async get(@PathParams("uid") uid: string) {
    const query = await DB.query(`SELECT *
                                  FROM player
                                  WHERE uid = $1`, [uid]);
    const result = query.rows.map(r => Player.hydrate<Player>(r))[0];
    if (result) return result;
    throw new NotFound("Player not found");
  }

  @Get("/:uid/teams")
  @ContentType("json")
  @Authenticate()
  async getTeams(@PathParams("uid") uid: string) {
    const result = await DB.query(`SELECT ppft.*,
                                          row_to_json(t.*) as team,
                                          row_to_json(c.*) as club,
                                          row_to_json(l.*) as league
                                   FROM player_play_for_team ppft
                                            INNER JOIN team t on ppft.teamid = t.id
                                            INNER JOIN club c on t.clubid = c.id
                                            INNER JOIN league l on t.leagueid = l.id
                                   WHERE ppft.playeruid = $1`, [uid]);

    return result.rows.map(r => PlayerTeam.hydrate<PlayerTeam>(r));
  }

  @Get("/:uid/avatar")
  @ContentType(Jimp.MIME_PNG)
  private async avatar(
    @PathParams("uid") uid: string
  ) {
    const path = `${rootDir}/storage/player/${uid}.png`;
    return Readable.from(await (await Jimp.read(path)
      .catch(() => Jimp.read(`https://i.pravatar.cc/500?u=${uid}`)))
      .cover(250, 250)
      .quality(50)
      .getBufferAsync(Jimp.MIME_PNG));
  }
}
