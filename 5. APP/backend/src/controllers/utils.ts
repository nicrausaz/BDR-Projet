import DB from "../db/DB";
import Administrator from "../models/Administrator";

export class Utils {

  static async checkAccessToPlayerRessource(administrator: Administrator, playerUid: string): Promise<boolean> {
    const result = await DB.query(`SELECT playeruid
                                   FROM administrator_player
                                   WHERE administratoruid = $1
                                     AND playeruid = $2
                                   LIMIT 1`, [administrator.uid, playerUid]);
    return result.rows.length == 1;
  }

  static async checkAccessToClubRessource(administrator: Administrator, clubId: number) : Promise<boolean> {
    const result = await DB.query(`SELECT clubid
                                   FROM administrator_club
                                   WHERE administratoruid = $1
                                     AND clubid = $2
                                   LIMIT 1`, [administrator.uid, clubId]);
    return result.rows.length == 1;
  }

  static async checkAccessToFederationRessource(administrator: Administrator, federationId: number) : Promise<boolean> {
    const result = await DB.query(`SELECT federationid
                                   FROM administrator_federation
                                   WHERE administratoruid = $1
                                     AND federationid = $2
                                   LIMIT 1`, [administrator.uid, federationId]);
    return result.rows.length == 1;
  }
}
