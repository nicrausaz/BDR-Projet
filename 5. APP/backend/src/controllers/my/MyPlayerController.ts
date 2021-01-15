import {
  BodyParams,
  Controller,
  Delete,
  Get,
  MultipartFile,
  Patch,
  PathParams,
  PlatformMulterFile,
  Post,
  Put,
  QueryParams,
  Req, UseBefore
} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import fs from "fs";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import {ContentType} from "@tsed/schema";
import Player from "../../models/Player";
import DB, {PoolClient} from "../../db/DB";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Training from "../../models/Training";

@Controller("/player")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyPlayerController {

  @Get("/")
  @ContentType("json")
  @Authenticate()
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const perms = await Utils.getAccessiblePlayersResources(<Administrator>request.user);
    return new Paginator(Player)
      .setTotalQuery(`
          SELECT count(*)
          FROM player
          WHERE uid = ANY ($1)
            AND (firstname ILIKE $2 OR lastname ILIKE $2)
            AND active = TRUE
      `, [perms])
      .setQuery(`
          SELECT *
          FROM player
          WHERE uid = ANY ($1)
            AND (firstname ILIKE $2 OR lastname ILIKE $2)
            AND active = TRUE
          ORDER BY firstname, lastname
      `, [perms])
      .create({query, limit, offset});
  }

  @Put()
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() player: Player) {
    const client = await PoolClient();
    try {
      await client.query("BEGIN");

      const res1 = await client.query(`INSERT INTO player(lastname, firstname, birthdate, height, weight, sex)
                                       VALUES ($1, $2, $3, $4, $5, $6)
                                       RETURNING *`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex]);

      await client.query(`INSERT INTO administrator_player (administratoruid, playeruid)
                          VALUES ($1, $2)`, [(<Administrator>request.user).uid, res1.rows[0].uid]);


      await client.query("COMMIT");

      return res1.rows.map((r) => Player.hydrate<Player>(r))[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Patch("/:uid")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("uid") uid: string, @BodyParams() player: Player) {

    if (!await Utils.checkAccessToPlayerResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized Resource");
    const result = await DB.query(`UPDATE player
                                   SET lastname  = $1,
                                       firstname = $2,
                                       birthdate = $3,
                                       height    = $4,
                                       weight    = $5,
                                       sex       = $6
                                   WHERE uid = $7
                                   RETURNING *`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex, uid]);

    return result.rows.map((r) => Player.hydrate<Player>(r))[0];
  }

  @Delete("/:uid")
  @ContentType("json")
  async delete(@Req() request: Req, @PathParams("uid") uid: string) {
    if (!await Utils.checkAccessToPlayerResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized Resource");

    const client = await PoolClient();
    try {
      await client.query("BEGIN");

      await client.query(`UPDATE player_play_for_team
                          SET endat = COALESCE(endat, NOW())
                          WHERE playeruid = $1`, [uid]);

      await client.query(`UPDATE player
                          SET active = FALSE
                          WHERE uid = $1`, [uid]);

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      if (fs.existsSync(`${rootDir}/storage/player/${uid}.png`)) {
        fs.unlinkSync(`${rootDir}/storage/player/${uid}.png`);
      }
    }
  }

  @Post("/:uid/avatar")
  private async uploadFile(@Req() request: Req, @PathParams("uid") uid: string, @MultipartFile("file") file: PlatformMulterFile) {
    if (!await Utils.checkAccessToPlayerResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized Resource");
    try {
      const img = await Jimp.read(file.path);
      img
        .cover(500, 500)
        .quality(75)
        .write(`${rootDir}/storage/player/${uid}.png`);
    } finally {
      fs.unlinkSync(file.path);
    }
    return true;
  }
}
