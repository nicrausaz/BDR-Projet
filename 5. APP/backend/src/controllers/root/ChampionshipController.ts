import {Controller, Get, PathParams, QueryParams, UseBefore} from "@tsed/common";
import {ContentType, Returns} from "@tsed/schema";
import DB from "../../db/DB";
import Championship from "../../models/Championship";
import {NotFound} from "@tsed/exceptions";
import {Authenticate} from "@tsed/passport";
import Utils from "../../utils/Utils";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/championship")
@UseBefore(RouteLogMiddleware)
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
}

