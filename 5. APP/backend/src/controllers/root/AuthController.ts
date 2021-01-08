import {BodyParams, Controller, Get, Post, Req, UseBefore} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import jwt from "jsonwebtoken";
import DB from "../../db/DB";
import Administrator from "../../models/Administrator";
import {Unauthorized} from "@tsed/exceptions";
import bcrypt from "bcrypt";
import {RouteLogMiddleware} from "../../middlewares/RouteLogMiddleware";

@Controller("/auth")
@UseBefore(RouteLogMiddleware)
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
    const token = jwt.sign({
      uid: user.uid
    }, "secret", {expiresIn: "1d"});

    return {token};
  }

  @Get("/getProfile")
  @Authenticate()
  async getProfile(@Req() request: Req) {
    return request.user;
  }

  @Post("/register")
  private async register(@BodyParams() admin: Administrator) {
    const query = await DB.query(
      `INSERT INTO administrator(email, password, lastname, firstname)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [
        admin.email,
        await bcrypt.hash(admin.password, 10),
        admin.lastname,
        admin.firstname
      ]);
    return query.rows.map(r => Administrator.hydrate<Administrator>(r))[0];
  }
}
