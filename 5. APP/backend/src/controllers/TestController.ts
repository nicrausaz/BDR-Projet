import {Controller, MultipartFile, PlatformMulterFile, Post} from "@tsed/common";
import * as fs from "fs";

@Controller("/test")
export class TestController {

  @Post("/file")
  private uploadFile1(@MultipartFile("file") file: PlatformMulterFile) {
    fs.unlinkSync(file.path);//delete file
    return file;
  }
}
