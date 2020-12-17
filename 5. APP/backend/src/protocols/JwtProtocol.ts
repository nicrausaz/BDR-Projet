import {Req} from "@tsed/common";
import {Arg, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import DB from "../db/DB";
import Administrator from "../models/Administrator";

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secret",
    ignoreExpiration: false
  }
})
export class JwtProtocol implements OnVerify {
  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    if (!jwtPayload?.uid) return false;
    const user = (await DB.query(
      `SELECT *
       FROM administrator
       WHERE uid = $1
       LIMIT 1`, [jwtPayload.uid]))
      .rows.map(r => Administrator.hydrate<Administrator>(r))[0];
    return user ?? false;
  }
}
