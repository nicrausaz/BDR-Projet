import {BodyParams, Controller, Get, Put, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB, {PoolClient} from "../../db/DB";
import {Authenticate} from "@tsed/passport";
import Game from "../../models/Game";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import CalendarEntry from "../../models/CalendarEntry";
import Training from "../../models/Training";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/event")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyEventController {
  @Get("/")
  @ContentType("json")
  async get() {
    const result = await DB.query(`SELECT *
                                   FROM event`);
    return result.rows;
  }

  @Get("/calendar")
  @ContentType("json")
  async getCalendar(@Req() request: Req, @QueryParams("start") start: string, @QueryParams("end") end: string) {
    const perms = [
      ...await Utils.getAccessibleTrainingResources(<Administrator>request.user),
      ...await Utils.getAccessibleGameResources(<Administrator>request.user)
    ];

    const result = await DB.query(`SELECT *
                                   FROM event_list
                                   WHERE startat BETWEEN $1 AND $2
                                     AND endat BETWEEN $1 AND $2
                                     AND uid = ANY ($3) `,
      [start, end, perms]);

    return result.rows.map(r => CalendarEntry.hydrate<CalendarEntry>(r));
  }
}

