import {Controller, Get, QueryParams, Req, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import Administrator from "../../models/Administrator";
import CalendarEntry from "../../models/CalendarEntry";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

/**
 * Manage event related to user
 */
@Controller("/event")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyEventController {

  /**
   * Get all accessible events of user
   * formated to be used with calendar
   * @param request
   * @param start
   * @param end
   */
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

