import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Club from '../models/Club';

@Controller("/club")
export class ClubController {

   @Get('/:id')
   @ContentType("json")
   async get(@PathParams("id") id: number) {
      const result = await DB.query(`SELECT c.id as club_id, c.name as club_name, s.name as sport_name
                                     FROM club c
                                              INNER JOIN sport s ON s.id = c.sportid
                                     WHERE c.id = $1`, [id]);
      return result.rows[0];
   }

   @Put('/')
   @ContentType("json")
   async put(@BodyParams() club: Club) {
      await DB.query(`INSERT INTO club (name, sportid)
                      VALUES ($1, $2)`, [club.name, club.sport.id]);
   }

   @Patch('/:id')
   @ContentType("json")
   async patch(@PathParams("id") id: number, @BodyParams() club: Club) {
      await DB.query(`UPDATE club
                      SET name    = $1,
                          sportid = $2
                      WHERE id = $3`, [club.name, club.sport.id, id]);
   }


   @Get('/:id/teams')
   @ContentType("json")
   async getTeams(@PathParams("id") id: number) {
      const result = await DB.query(`SELECT t.id as team_id, t.name as team_name
                                     FROM club c
                                              INNER JOIN team t ON c.id = t.clubid
                                     WHERE c.id = $1`, [id]);
      return result.rows;
   }
}
