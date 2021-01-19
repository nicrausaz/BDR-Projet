import {
  BodyParams,
  Controller,
  Delete,
  Get, MultipartFile,
  Patch,
  PathParams, PlatformMulterFile,
  Post,
  Put,
  QueryParams,
  Req,
  UseBefore
} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import Club from "../../models/Club";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import fs from "fs";

@Controller("/club")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyClubController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0) {
    const perms = await Utils.getAccessibleClubResources(<Administrator>request.user);

    return new Paginator(Club)
      .setTotalQuery(`
          SELECT count(*)
          FROM club c
                   INNER JOIN sport s ON s.id = c.sportid
          WHERE c.id = ANY ($1)
            AND c.name ILIKE $2
            AND c.active = TRUE
      `, [perms])
      .setQuery(`SELECT c.*, row_to_json(s.*) as sport
                 FROM club c
                          INNER JOIN sport s ON s.id = c.sportid
                 WHERE c.id = ANY ($1)
                   AND c.name ILIKE $2
                   AND c.active = TRUE
                 ORDER BY name
      `, [perms])
      .create({query, limit, offset});
  }

  @Put("/")
  @ContentType("json")
  async put(@Req() request: Req, @BodyParams() club: Club) {
    const client = await PoolClient();
    try {
      await client.query("BEGIN");

      const res1 = await client.query(
          `INSERT INTO club (name, sportid)
           VALUES ($1, $2)
           RETURNING *`, [club.name, club.sport.id]);

      const res2 = await client.query(`INSERT INTO administrator_club (administratoruid, clubid)
                                       VALUES ($1, $2)`, [(<Administrator>request.user).uid, res1.rows[0].id]);

      await client.query("COMMIT");

      return res1.rows.map(r => Club.hydrate<Club>(r))[0];
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@Req() request: Req, @PathParams("id") id: number, @BodyParams() club: Club) {
    if (!await Utils.checkAccessToClubResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");

    const result = await DB.query(
        `UPDATE club
         SET name    = $1,
             sportid = $2
         WHERE id = $3
         RETURNING *`, [club.name, club.sport.id, id]);

    return result.rows.map(r => Club.hydrate<Club>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(@Req() request: Req, @PathParams("id") id: number) {
    const client = await PoolClient();
    try {
      await client.query("BEGIN");

      const res1 = await client.query(`UPDATE team
                                       SET active = FALSE
                                       WHERE clubid = $1
                                       RETURNING id`, [id]);

      if (res1.rows.length) {
        const res2 = await client.query(`UPDATE player_play_for_team
                                         SET endat = COALESCE(endat, NOW())
                                         WHERE teamid = $1`, [res1.rows[0].id]);
      }

      const res3 = await client.query(`UPDATE club
                                       SET active = FALSE
                                       WHERE id = $1`, [id]);

      await client.query("COMMIT");

    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
      if (fs.existsSync(`${rootDir}/storage/club/${id}.png`)) {
        fs.unlinkSync(`${rootDir}/storage/club/${id}.png`);
      }
    }
  }

  @Post("/:id/avatar")
  private async uploadFile(@Req() request: Req, @PathParams("id") id: number, @MultipartFile("file") file: PlatformMulterFile) {
    if (!await Utils.checkAccessToClubResource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized Resource");
    try {
      const img = await Jimp.read(file.path);
      img
        .contain(500, 500)
        .quality(75)
        .write(`${rootDir}/storage/club/${id}.png`);
    } finally {
      fs.unlinkSync(file.path);
    }
    return true;
  }
}
