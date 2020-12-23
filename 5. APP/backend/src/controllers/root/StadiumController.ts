import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import Stadium from "../../models/Stadium";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import {Utils} from "../../Utils";

@Controller("/stadium")
@Authenticate()
export class StadiumController {

  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return Utils.createSimpleSearchPaginate(Stadium, "stadium", ["name"], query, limit, offset);
  }

  @Get("/:id")
  @ContentType("json")
  async get(
    @PathParams("id") id: string
  ) {
    const query = await DB.query(
      `SELECT *
       FROM stadium
       WHERE id = $1`, [id]);
    const result = query.rows.map(r => Stadium.hydrate<Stadium>(r))[0];
    if (result) return result;
    throw new NotFound("Stadium not found");
  }

  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() stadium: Stadium) {
    const result = await DB.query(
      `INSERT INTO stadium (name, address, capacity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [stadium.name, stadium.address, stadium.capacity]
    );

    return result.rows.map((r) => Stadium.hydrate<Stadium>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async update(
    @PathParams("id") id: string,
    @BodyParams() stadium: Stadium
  ) {
    const result = await DB.query(
      `UPDATE stadium
       SET name     = $1,
           address  = $2,
           capacity = $3
       WHERE id = $4
       RETURNING *`,
      [stadium.name, stadium.address, stadium.capacity, id]
    );

    return result.rows.map((r) => Stadium.hydrate<Stadium>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(
    @PathParams("id") id: string
  ) {
    await DB.query(
      `DELETE
       FROM stadium
       WHERE id = $1`,
      [id]
    );
  }
}

