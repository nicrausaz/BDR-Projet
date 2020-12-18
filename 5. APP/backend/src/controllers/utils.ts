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

  static async checkAccessToClubRessource(administrator: Administrator, clubId: number): Promise<boolean> {
    const result = await DB.query(`SELECT clubid
                                   FROM administrator_club
                                   WHERE administratoruid = $1
                                     AND clubid = $2
                                   LIMIT 1`, [administrator.uid, clubId]);
    return result.rows.length == 1;
  }

  static async checkAccessToFederationRessource(administrator: Administrator, federationId: number): Promise<boolean> {
    const result = await DB.query(`SELECT federationid
                                   FROM administrator_federation
                                   WHERE administratoruid = $1
                                     AND federationid = $2
                                   LIMIT 1`, [administrator.uid, federationId]);
    return result.rows.length == 1;
  }

  static async checkAccessToTeamRessource(administrator: Administrator, teamId: number): Promise<boolean> {
    const result = await DB.query(`SELECT *
                                   FROM administrator_club ac
                                            INNER JOIN club c on ac.clubid = c.id
                                            INNER JOIN team t on c.id = t.clubid
                                   WHERE ac.administratoruid = $1
                                     AND t.id = $2
                                   LIMIT 1;`, [administrator.uid, teamId]);

    return result.rows.length == 1;
  }

  static async checkAccessToChampionshipRessource(administrator: Administrator, championshipId: number): Promise<boolean> {

    const result = await DB.query(`SELECT c.id
                                   FROM championship c
                                            INNER JOIN league l on c.leagueid = l.id
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE c.id = $1
                                     AND af.administratoruid = $2 LIMIT 1;`, [administrator.uid, championshipId]);

    return result.rows.length == 1;
  }


  static async getAccessibleClubRessources(administrator: Administrator) {

    const result = await DB.query(`SELECT clubid
                                   FROM administrator_club
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.clubid);
  }

  static async getAccessiblePlayersRessources(administrator: Administrator) {

    const result = await DB.query(`SELECT playeruid
                                   FROM administrator_player
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.playeruid);
  }

  static async getAccessibleFederationRessources(administrator: Administrator) {

    const result = await DB.query(`SELECT federationid
                                   FROM administrator_federation
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.federationid);
  }

  static async getAccessibleChampionshipRessources(administrator: Administrator) {

  }


}
