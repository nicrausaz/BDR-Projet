import {Controller, Get, PathParams, QueryParams, Req} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {NotFound, Unauthorized} from "@tsed/exceptions";
import Training from "../../models/Training";
import {Authenticate} from "@tsed/passport";
import Paginator from "../../utils/Paginator";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";

@Controller("/training")
@Authenticate()
export class MyTrainingController {
  @Get("/")
  @ContentType("json")
  async getAll(
    @Req() request: Req,
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    const perms = await Utils.getAccessibleTrainingResources(<Administrator>request.user);
    return new Paginator(Training)
      .setTotalQuery(`
          SELECT count(*)
          FROM event_training
          WHERE uid = ANY ($1)
            AND name ILIKE $2
      `, [perms])
      .setQuery(`
          SELECT t.*, row_to_json(s.*) as stadium, row_to_json(team.*) as team
          FROM event_training t
                   INNER JOIN stadium s ON s.id = t.stadiumid
                   INNER JOIN team ON team.id = t.teamid
          WHERE t.uid = ANY ($1)
            AND t.name ILIKE $2
          ORDER BY t.startat DESC
      `, [perms])
      .create({query, limit, offset});
  }

  @Get("/:uid")
  @ContentType("json")
  async get(
    @Req() request: Req,
    @PathParams("uid") uid: string
  ) {
    if (!await Utils.checkAccessToTrainingResource(<Administrator>request.user, uid)) throw new Unauthorized("Unauthorized ressource");

    const query = await DB.query(`
        SELECT t.*, row_to_json(s.*) as stadium, row_to_json(th.*) as team
        FROM event_training t
                 INNER JOIN stadium s ON s.id = t.stadiumid
                 INNER JOIN team th ON th.id = t.teamid
        WHERE t.uid = $1
    `, [uid]);

    const result = query.rows.map(r => Training.hydrate<Training>(r))[0];
    if (result) return result;
    throw new NotFound("Training not found");
  }
}

