import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import League from "../models/League";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Federation from "../models/Federation";

@Controller("/league")
@Authenticate()
export class LeagueController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const result = await DB.query(`
        SELECT *
       FROM league
        WHERE c.name ILIKE $1
        LIMIT $2 OFFSET $3
    `, [`%${query}%`, limit, offset])
    return result.rows.map(r => League.hydrate<League>(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(
    @PathParams("id") id: string
  ) {
    const query = await DB.query(
      `SELECT *
       FROM league
       WHERE id = $1`, [id]);
    const result = query.rows.map(r => League.hydrate<League>(r))[0];
    if (result) return result;
    throw new NotFound("League not found");
  }

  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() league: League) {
    const result = await DB.query(
      `INSERT INTO league (level, gender)
       VALUES ($1, $2) RETURNING *`,
      [league.level, league.gender]
    );

    return result.rows.map((r) => League.hydrate<League>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async update(
    @PathParams("id") id: string,
    @BodyParams() league: League
  ) {
    const result = await DB.query(
      `UPDATE league
       SET level  = $1,
           gender = $2
       WHERE id = $3 RETURNING *`,
      [league.level, league.gender, id]
    );

    return result.rows.map((r) => League.hydrate<League>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(
    @PathParams("id") id: string
  ) {
    await DB.query(
      `DELETE
       FROM league
       WHERE id = $1`,
      [id]
    );
  }
}

