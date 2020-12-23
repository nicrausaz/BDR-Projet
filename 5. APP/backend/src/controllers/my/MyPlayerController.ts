import {
  BodyParams,
  Controller,
  MultipartFile,
  Patch,
  PathParams,
  PlatformMulterFile,
  Post,
  Put,
  Req
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
import DB from "../../db/DB";

@Controller("/player")
@Authenticate()
export class MyPlayerController {

  @Put()
  @ContentType("json")
  async put(@BodyParams() player: Player) {
    const result = await DB.query(`INSERT INTO player(lastname, firstname, birthdate, height, weight, sex)
                                   VALUES ($1, $2, $3, $4, $5, $6)
                                   RETURNING *`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex]);

    return result.rows.map((r) => Player.hydrate<Player>(r))[0];
  }

  @Patch("/:uid")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("uid") uid: string, @BodyParams() player: Player) {

    if (!await Utils.checkAccessToPlayerResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized Resource");
    //TODO add many to many
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
