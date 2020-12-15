import {BodyParams, Controller, Get, Post, Req} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import jwt from "jwt-simple";
import DB from "../db/DB";
import Administrator from "../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";

@Controller("/auth")
export class AuthController {
  @Post("/login")
  async login(@Req() req: Req, @BodyParams("email") email: string, @BodyParams("password") password: string) {
    const user = (await DB.query(
      `SELECT *
       FROM administrator
       WHERE email = $1
       LIMIT 1`, [email])).rows.map(r => Administrator.hydrate<Administrator>(r))[0];
    if (!user || !await user.verifyPassword(password)) {
      throw new Unauthorized("Wrong credentials");
    }
    return {
      token: jwt.encode({
        uid: user.uid
      }, "secret")
    };
  }

  @Get("/getProfile")
  @Authenticate()
  getProfile(@Req() request: Req) {
    return request.user;
  }
}
