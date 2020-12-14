import {BodyParams, Controller, Get, Patch, PathParams, Put} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Season from "../models/Season";
import {NotFound} from "@tsed/exceptions";

@Controller("/season")
export class SeasonController {

  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(`SELECT *
                                   FROM season`);
    return result.rows.map(r => Season.hydrate(r));
  }

  @Get("/:id")
  @ContentType("json")
  async get(@PathParams("id") id: number) {
    const query = await DB.query(`SELECT *
                                  FROM season
                                  WHERE id = $1`, [id]);
    const result = query.rows.map(r => Season.hydrate(r))[0];
    if (result) return result;
    throw new NotFound("Season not found");
  }

  @Put("/")
  @ContentType("json")
  async put(@BodyParams() season: Season) {
    await DB.query(`INSERT INTO season(name, startat, endat)
                    VALUES ($1, $2, $3)`, [season.name, season.startAt, season.endAt]);
  }

  @Patch("/:id")
  @ContentType("json")
  async patch(@PathParams("id") id: number, @BodyParams() season: Season) {
    await DB.query(`UPDATE season
                    SET name    = $1,
                        startat = $2,
                        endat   = $3
                    WHERE id = $4`, [season.name, season.startAt, season.endAt, id]);
  }
}
