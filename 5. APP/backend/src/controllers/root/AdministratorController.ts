import {Controller, Get, PathParams, UseAfter, UseBefore} from "@tsed/common";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import {ContentType} from "@tsed/schema";
import {Readable} from "stream";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/administrator")
@UseBefore(RouteLogMiddleware)
export class AdministratorController {
  @Get("/:uid/avatar")
  @ContentType(Jimp.MIME_PNG)
  private async avatar(
    @PathParams("uid") uid: string
  ) {
    const path = `${rootDir}/storage/administrator/${uid}.png`;
    return Readable.from(await (await Jimp.read(path)
      .catch(() => Jimp.read(`https://i.pravatar.cc/500?u=${uid}`)))
      .cover(250, 250)
      .quality(50)
      .getBufferAsync(Jimp.MIME_PNG));
  }
}
