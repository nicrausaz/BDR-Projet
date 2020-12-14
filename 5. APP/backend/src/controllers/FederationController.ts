import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Federation from "../models/Federation";
import {NotFound} from "@tsed/exceptions";

@Controller("/federation")
export class FederationController {

  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(
      `SELECT f.*, row_to_json(s.*) as sport
       FROM federation f
                INNER JOIN sport s ON s.id = f.sportid`);
    return result.rows.map(r => Federation.hydrate(r));
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
    const result = query.rows.map(r => Federation.hydrate(r))[0];
    if (result) return result;
    throw new NotFound("Federation not found");
  }

  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() federation: Federation) {
    await DB.query(
      `INSERT INTO federation (name, sportid)
       VALUES ($1, $2)`,
      [federation.name, federation.sport.id]
    );
    return federation; // TODO: send full object
  }

  @Patch("/:id")
  @ContentType("json")
  async update(
    @PathParams("id") id: number,
    @BodyParams() federation: Federation
  ) {
    await DB.query(
      `UPDATE federation
       SET name = $1
       WHERE id = $2`,
      [federation.name, id]
    );
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(
    @PathParams("id") id: number
  ) {
    const results = await DB.query(
      `DELETE
       FROM federation
       WHERE id = $1`,
      [id]
    );
    return results.rows;
  }

  //TODO DELETE
}

