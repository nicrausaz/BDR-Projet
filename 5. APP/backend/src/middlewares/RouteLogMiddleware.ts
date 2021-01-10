import {IMiddleware, Middleware, Req, Res} from "@tsed/common";
import {MySocketService} from "../services/MySocketService";
import Administrator from "../models/Administrator";

@Middleware()
export class RouteLogMiddleware implements IMiddleware {
  constructor(private mySocketService: MySocketService) {

  }

  private static getDurationInMilliseconds(start: [number, number]) {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  }

  use(@Req() req: Req, @Res() res: Res) {
    const start = process.hrtime();
    res.on("close", () => {
      this.mySocketService.io.emit("apiRequest", {
        id: req.id,
        user: (<Administrator>req.user)?.email,
        path: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        method: req.method,
        at: Date.now(),
        duration: RouteLogMiddleware.getDurationInMilliseconds(start)
      });
    });
  }
}
