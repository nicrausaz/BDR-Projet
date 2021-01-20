import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Player from "../../models/Player";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import {Readable} from "stream";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

/**
 * Public player endpoint
 */
@Controller("/player")
@UseBefore(RouteLogMiddleware)
export class PlayerController {
  /**
   * Retrieve all players
   * @param query
   * @param limit
   * @param offset
   */
  /*
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
          WHERE (firstname ILIKE $1 OR lastname ILIKE $1) AND active = TRUE;
      `)
      .setQuery(`
          SELECT *
          FROM player
          WHERE (firstname ILIKE $1 OR lastname ILIKE $1) AND active = TRUE
          ORDER BY firstname, lastname
      `)
      .create({query, limit, offset});
  }
*/
  /**
   * Retrieve a player
   * @param uid
   */
  @Get("/:uid")
  @ContentType("json")
  @Authenticate()
  async get(@PathParams("uid") uid: string) {
    const query = await DB.query(`SELECT *
                                  FROM player
                                  WHERE uid = $1 AND active = TRUE`, [uid]);
    const result = query.rows.map(r => Player.hydrate<Player>(r))[0];
    if (result) return result;
    throw new NotFound("Player not found");
  }

  /**
   * Retrieve player's picture
   * @param uid
   * @private
   */
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
