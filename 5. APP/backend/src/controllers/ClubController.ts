import {BodyParams, Controller, Get, Patch, PathParams, Put, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Club from "../models/Club";
import Team from "../models/Team";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "./utils";
import Administrator from "../models/Administrator";

@Controller("/club")
@Authenticate()
export class ClubController {

  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(
        `SELECT c.*, row_to_json(s.*) as sport
         FROM club c
                  INNER JOIN sport s ON s.id = c.sportid`);
    return result.rows.map(r => Club.hydrate<Club>(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(
        `SELECT c.*, row_to_json(s.*) as sport
         FROM club c
                  INNER JOIN sport s ON s.id = c.sportid
         WHERE c.id = $1`, [id]);
    const result = query.rows.map(r => Club.hydrate<Club>(r))[0];
    if (result) return result;
    throw new NotFound("Club not found");
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

    if (!await Utils.checkAccessToClubRessource(<Administrator>request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(
        `UPDATE club
         SET name    = $1,
             sportid = $2
         WHERE id = $3
         RETURNING *`, [club.name, club.sport.id, id]);

    return result.rows.map(r => Club.hydrate<Club>(r))[0];
  }


  @Get("/:id/teams")
  @ContentType("json")
  async getTeams(@PathParams("id") id: number) {
    const result = await DB.query(
        `SELECT t.*
         FROM club c
                  INNER JOIN team t ON c.id = t.clubid
         WHERE c.id = $1`, [id]);
    return result.rows.map(r => Team.hydrate<Team>(r));
  }
}
