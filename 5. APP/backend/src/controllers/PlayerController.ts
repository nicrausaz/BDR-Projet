import {BodyParams, Controller, Delete, Get, Patch, PathParams, Put} from "@tsed/common";
import {ContentType} from "@tsed/schema";
import DB from "../db/DB";
import Player from '../models/player';

@Controller("/player")
export class PlayerController {

   @Get('/:id')
   @ContentType("json")
   async get(@PathParams("id") id: string) {
      const result = await DB.query(`SELECT *
                                     FROM player
                                     WHERE uid = $1`, [id]);
      return result.rows[0];
   }

   @Put()
   @ContentType("json")
   async put(@BodyParams() player: Player) {
      await DB.query(`INSERT INTO player(lastname, firstname, birthdate, height, weight, sex)
                      VALUES ($1, $2, $3, $4, $5, $6)`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex]);
   }

   @Patch('/:id')
   @ContentType("json")
   async patch(@PathParams("id") id: string, @BodyParams() player: Player) {
      await DB.query(`UPDATE player
                      SET lastname  = $1,
                          firstname = $2,
                          birthdate = $3,
                          height    = $4,
                          weight    = $5,
                          sex       = $6
                      WHERE uid = $7`, [player.lastname, player.firstname, player.birthdate, player.height, player.weight, player.sex, id]);
   }

   @Get('/:id/teams')
   @ContentType("json")
   async getTeams(@PathParams("id") id: string) {
      const result = await DB.query(`SELECT *
                                     FROM player_play_for_team ppft
                                              INNER JOIN team t on ppft.teamid = t.id
                                     WHERE ppft.playeruid = $1`, [id]);

      return result.rows;
   }
   // Get events ?

}
