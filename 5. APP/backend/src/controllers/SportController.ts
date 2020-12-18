import {BodyParams, Controller, Delete, Get, PathParams, Put, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Sport from "../models/Sport";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";

@Controller("/sport")
@Authenticate()
export class SportController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query?: string,
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const result = await DB.query(`
        SELECT *
        FROM sport
        WHERE name ILIKE $1
        LIMIT $2 OFFSET $3
    `, [`%${query}%`, limit, offset]);
    return result.rows.map(r => Sport.hydrate<Sport>(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(`SELECT *
                                  FROM sport
                                  WHERE id = $1`, [id]);
    const result = query.rows.map(r => Sport.hydrate<Sport>(r))[0];
    if (result) return result;
    throw new NotFound("Sport not found");
  }

  @Put("/")
  @ContentType("json")
  async put(@BodyParams() sport: Sport) {
    const result = await DB.query(`INSERT INTO sport(name)
                                   VALUES ($1)
                                   RETURNING *`, [sport.name]);

    return result.rows.map((r) => Sport.hydrate<Sport>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(@PathParams("id") id: number) {
    const result = await DB.query(`DELETE
                                   FROM sport
                                   WHERE id = $1`, [id]);
  }
}
