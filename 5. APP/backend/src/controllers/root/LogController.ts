import {Controller, Get, QueryParams, UseBefore} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import {Authenticate} from "@tsed/passport";
import Log from "../../models/Log";
import Paginator from "../../utils/Paginator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

/**
 * Public log endpoint
 *
 * Logs are insert and update on database ressources
 */
@Controller("/log")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class LogController {

  /**
   * Get all logs
   * @param query
   * @param limit
   * @param offset
   */
  @Get("/")
  @ContentType("json")
  async getAll(
    @QueryParams("q")query: string = "",
    @QueryParams("limit")limit: number = 20,
    @QueryParams("offset")offset: number = 0
  ) {
    return new Paginator(Log)
      .setTotalQuery(`
          SELECT count(*)
          FROM event_log
          WHERE event ILIKE $1
      `)
      .setQuery(`
          SELECT *
          FROM event_log e
          WHERE e.event ILIKE $1
          ORDER BY executedat DESC 
      `)
      .create({query, limit, offset});
  }
}

