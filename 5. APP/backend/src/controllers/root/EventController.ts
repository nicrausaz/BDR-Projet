import {Controller, Get} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../../db/DB";
import {Authenticate} from "@tsed/passport";

@Controller("/event")
@Authenticate()
export class EventController {
  @Get("/test")
  @ContentType("json")
  async get() {
    const result = await DB.query(`SELECT *
                                   FROM event`);
    return result.rows;
  }
}

