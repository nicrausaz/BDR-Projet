import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put, QueryParams} from "@tsed/common";
import {ContentType, Returns} from "@tsed/schema";
import DB from "../db/DB";
import Championship from "../models/Championship";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Club from "../models/Club";
import {Utils} from "./utils";
import Season from "../models/Season";

@Controller("/championship")
@Authenticate()
export class ChampionshipController {

  @Get("/")
  @(Returns(200, Championship).Of(Championship).Description("All Championship"))
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return Utils.createSimpleSearchPaginate(Championship, "championship", ["name"], query, limit, offset);
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: string) {
    const query = await DB.query(
        `SELECT *
         FROM championship
         WHERE id = $1`, [id]);

    const result = query.rows.map(r => Championship.hydrate<Championship>(r))[0];
    if (result) return result;
    throw new NotFound("Championship not found");
  }

  @Put("/")
  @ContentType("json")
  async insert(@BodyParams() championship: Championship) {
    const result = await DB.query(
        `INSERT INTO championship (name, startat, endat)
         VALUES ($1, $2, $3) RETURNING *`,
      [championship.name, championship.startAt, championship.endAt]
    );

    return result.rows.map((r) => Championship.hydrate<Championship>(r))[0];
  }

  @Patch("/:id")
  @ContentType("json")
  async update(
    @PathParams("id") id: string,
    @BodyParams() championship: Championship
  ) {
    const result = await DB.query(
        `UPDATE championship
         SET name    = $1,
             startat = $2,
             endat   = $3
         WHERE id = $4
         RETURNING *`,
      [championship.name, championship.startAt, championship.endAt, id]
    );

    return result.rows.map((r) => Championship.hydrate<Championship>(r))[0];
  }

  @Delete("/:id")
  @ContentType("json")
  async delete(@PathParams("id") id: string) {
    await DB.query(`DELETE
                    FROM championship
                    WHERE id = $1`, [id]);
  }
}

