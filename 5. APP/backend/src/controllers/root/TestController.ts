import {Controller, MultipartFile, PlatformMulterFile, Post} from "@tsed/common";
import * as fs from "fs";
import Jimp from "jimp";
import {rootDir} from "../../Server";

@Controller("/test")
export class TestController {

  @Post("/file")
  private async uploadFile(@MultipartFile("file") file: PlatformMulterFile) {
    try {
      const img = await Jimp.read(file.path);
      const name = file.originalname;
      img
        .cover(500, 500)
        .quality(75)
        .write(`${rootDir}/storage/${name}.png`);
    } finally {
      fs.unlinkSync(file.path);
    }
  }
}
