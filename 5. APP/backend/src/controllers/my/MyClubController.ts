import {BodyParams, Controller, Get, Patch, PathParams, Put, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Club from "../../models/Club";
import {Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../../Utils";
import Administrator from "../../models/Administrator";

@Controller("/club")
@Authenticate()
export class MyClubController {

  @Get("/")
  @ContentType("json")
  async getAll(@Req() request: Req) {
    const perms = await Utils.getAccessibleClubResources(<Administrator>request.user);

    const result = await DB.query(
      `SELECT c.*, row_to_json(s.*) as sport
         FROM club c
                  INNER JOIN sport s ON s.id = c.sportid
         WHERE c.id = ANY ($1)`, [perms]);

    return result.rows.map(r => Club.hydrate<Club>(r));
  }

  @Put("/")
  @ContentType("json")
  async put(@BodyParams() club: Club) {
    const result = await DB.query(
      `INSERT INTO club (name, sportid)
       VALUES ($1, $2)
       RETURNING *`, [club.name, club.sport.id]);

    return result.rows.map(r => Club.hydrate<Club>(r))[0];
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

}
