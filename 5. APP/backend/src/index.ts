import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";
import DB from "./db/DB";

(async () => {
  try {
    $log.debug("Start server...");
    await DB.connect();
    const platform = await PlatformExpress.bootstrap(Server);

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
})();
