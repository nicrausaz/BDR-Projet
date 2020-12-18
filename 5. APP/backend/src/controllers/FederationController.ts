import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Federation from "../models/Federation";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "./utils";
import Administrator from "../models/Administrator";

@Controller("/federation")
@Authenticate()
export class FederationController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const result = await DB.query(`
        SELECT f.*, row_to_json(s.*) as sport
       FROM federation f
                INNER JOIN sport s ON s.id = f.sportid
        WHERE f.name ILIKE $1
        LIMIT $2 OFFSET $3
    `, [`%${query}%`, limit, offset])
    return result.rows.map(r => Federation.hydrate<Federation>(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(
    @PathParams("id") id: number
  ) {
    const query = await DB.query(
      `SELECT f.*, row_to_json(s.*) as sport
       FROM federation f
                INNER JOIN sport s ON s.id = f.sportid
       WHERE f.id = $1`, [id]);
    const result = query.rows.map(r => Federation.hydrate<Federation>(r))[0];
    if (result) return result;
    throw new NotFound("Federation not found");
  }

  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() federation: Federation) {
    const result = await DB.query(
      `INSERT INTO federation (name, sportid)
       VALUES ($1, $2) RETURNING *`,
      [federation.name, federation.sport.id]
    );

    return result.rows.map((r) => Federation.hydrate<Federation>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async update(@Req() request: Req, @PathParams("id") id: number, @BodyParams() federation: Federation) {

    if (!await Utils.checkAccessToFederationRessource(<Administrator> request.user, id)) throw new Unauthorized("Unauthorized ressource");

    const result = await DB.query(`UPDATE federation SET name = $1 WHERE id = $2 RETURNING *`, [federation.name, id]);

    return result.rows.map((r) => Federation.hydrate<Federation>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(@PathParams("id") id: number) {
    await DB.query(`DELETE FROM federation WHERE id = $1`, [id]);
  }
}

