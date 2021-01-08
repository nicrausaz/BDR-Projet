import {Controller, Get, PathParams, QueryParams} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {NotFound} from "@tsed/exceptions";
import Training from "../../models/Training";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";

@Controller("/training")
@Authenticate()
export class TrainingController {
  @Get("/:uid")
  @ContentType("json")
  async get(
    @PathParams("uid") uid: string
  ) {
    // TODO: check access to event

    const query = await DB.query(
      `SELECT t.*, row_to_json(s.*) as stadium, row_to_json(th.*) as team
       FROM event_training t
                INNER JOIN stadium s ON s.id = t.stadiumid
                INNER JOIN team th ON th.id = t.teamid
       WHERE t.uid = $1`, [uid]);

    const result = query.rows.map(r => Training.hydrate<Training>(r))[0];
    if (result) return result;
    throw new NotFound("Training not found");
  }
}

