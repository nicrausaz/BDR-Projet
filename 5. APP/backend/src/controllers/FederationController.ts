import {Controller, Get, PathParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Federation from "../models/Federation";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";

@Controller("/federation")
@Authenticate()
export class FederationController {

  @Get("/")
  @ContentType("json")
  async getAll() {
    const result = await DB.query(`SELECT f.*, row_to_json(s.*) as sport
                                   FROM federation f
                                            INNER JOIN sport s ON s.id = f.sportid`);
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
}

