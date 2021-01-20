import {Controller, Get, MultipartFile, PlatformMulterFile, Post, Req, UseBefore} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import Jimp from "jimp";
import {rootDir} from "../../Server";
import fs from "fs";
import Administrator from "../../models/Administrator";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

/**
 * Users
 */
@Controller("/account")
@UseBefore(RouteLogMiddleware)
@Authenticate()
export class MyAccountController {

  /**
   * Get User data
   * @param request
   */
  @Get("/")
  async getProfile(@Req() request: Req) {
    return <Administrator>request.user;
  }

  /**
   * Set & upload user's profile pic
   * @param req
   * @param file
   * @private
   */
  @Post("/avatar")
  private async uploadFile(@Req() req: Req, @MultipartFile("file") file: PlatformMulterFile) {
    try {
      const img = await Jimp.read(file.path);
      const name = (<Administrator>req.user).uid;
      img
        .cover(500, 500)
        .quality(75)
        .write(`${rootDir}/storage/administrator/${name}.png`);
    } finally {
      fs.unlinkSync(file.path);
    }
    return true;
  }
}
