import DB from "../db/DB";
import Administrator from "../models/Administrator";

export default class Utils {

  static async checkAccessToPlayerResource(administrator: Administrator, playerUid: string): Promise<boolean> {
    const result = await DB.query(`SELECT playeruid
                                   FROM administrator_player
                                   WHERE administratoruid = $1
                                     AND playeruid = $2
                                   LIMIT 1`, [administrator.uid, playerUid]);
    return result.rows.length == 1;
  }

  static async checkAccessToClubResource(administrator: Administrator, clubId: number): Promise<boolean> {
    const result = await DB.query(`SELECT clubid
                                   FROM administrator_club
                                   WHERE administratoruid = $1
                                     AND clubid = $2
                                   LIMIT 1`, [administrator.uid, clubId]);
    return result.rows.length == 1;
  }

  static async checkAccessToFederationResource(administrator: Administrator, federationId: number): Promise<boolean> {
    const result = await DB.query(`SELECT federationid
                                   FROM administrator_federation
                                   WHERE administratoruid = $1
                                     AND federationid = $2
                                   LIMIT 1`, [administrator.uid, federationId]);
    return result.rows.length == 1;
  }

  static async checkAccessToLeagueResource(administrator: Administrator, leagueId: number): Promise<boolean> {
    const result = await DB.query(`SELECT l.id
                                   FROM administrator_federation
                                            INNER JOIN league l on administrator_federation.federationid = l.federationid
                                   WHERE administratoruid = $1
                                     AND l.id = $2
                                   LIMIT 1`, [administrator.uid, leagueId]);

    return result.rows.length == 1;
  }

  static async checkAccessToTrainingResource(administrator: Administrator, eventUid: string) {
    const result = await DB.query(`SELECT t.uid
                                   FROM event_training t
                                            INNER JOIN team on t.teamid = team.id
                                            INNER JOIN club c on team.clubid = c.id
                                            INNER JOIN administrator_club ac on c.id = ac.clubid
                                   WHERE ac.administratoruid = $1
                                     AND t.uid = $2
                                   LIMIT 1`, [administrator.uid, eventUid]);
    return result.rows.length == 1;
  }

  static async checkAccessToGameResource(administrator: Administrator, eventUid: string) {
    const result = await DB.query(`SELECT g.uid
                                   FROM event_game g
                                            INNER JOIN championship c on g.championshipid = c.id
                                            INNER JOIN league l on c.leagueid = l.id
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE af.administratoruid = $1
                                     AND g.uid = $2`, [administrator.uid, eventUid]);
    return result.rows.length == 1;
  }

  static async checkAccessToTeamResource(administrator: Administrator, teamId: number): Promise<boolean> {
    const result = await DB.query(`SELECT *
                                   FROM administrator_club ac
                                            INNER JOIN club c on ac.clubid = c.id
                                            INNER JOIN team t on c.id = t.clubid
                                   WHERE ac.administratoruid = $1
                                     AND t.id = $2
                                   LIMIT 1;`, [administrator.uid, teamId]);

    return result.rows.length == 1;
  }

  static async checkAccessToChampionshipResource(administrator: Administrator, championshipId: number): Promise<boolean> {

    const result = await DB.query(`SELECT c.id
                                   FROM championship c
                                            INNER JOIN league l on c.leagueid = l.id
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE af.administratoruid = $1
                                     AND c.id = $2
                                   LIMIT 1;`, [administrator.uid, championshipId]);

    return result.rows.length == 1;
  }


  static async getAccessibleClubResources(administrator: Administrator) {

    const result = await DB.query(`SELECT clubid
                                   FROM administrator_club
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.clubid);
  }

  static async getAccessiblePlayersResources(administrator: Administrator) {

    const result = await DB.query(`SELECT playeruid
                                   FROM administrator_player
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.playeruid);
  }

  static async getAccessibleFederationResources(administrator: Administrator) {

    const result = await DB.query(`SELECT federationid
                                   FROM administrator_federation
                                   WHERE administratoruid = $1`, [administrator.uid]);

    return result.rows.map(p => p.federationid);
  }

  static async getAccessibleChampionshipResources(administrator: Administrator) {
    const result = await DB.query(`SELECT c.id
                                   FROM championship c
                                            INNER JOIN league l on c.leagueid = l.id
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE af.administratoruid = $1`, [administrator.uid]);
    return result.rows.map(p => p.id);
  }

  static async getAccessibleLeagueRessources(administrator: Administrator) {
    const result = await DB.query(`SELECT l.id
                                   FROM league l
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE af.administratoruid = $1`, [administrator.uid]);
    return result.rows.map(p => p.id);
  }

  static async getAccessibleTrainingResources(administrator: Administrator) {
    const result = await DB.query(`SELECT t.uid
                                   FROM event_training t
                                            INNER JOIN team on t.teamid = team.id
                                            INNER JOIN club c on team.clubid = c.id
                                            INNER JOIN administrator_club ac on c.id = ac.clubid
                                   WHERE ac.administratoruid = $1`, [administrator.uid]);
    return result.rows.map(p => p.uid);
  }

  static async getAccessibleGameResources(administrator: Administrator) {
    const result = await DB.query(`SELECT g.uid
                                   FROM event_game g
                                            INNER JOIN championship c on g.championshipid = c.id
                                            INNER JOIN league l on c.leagueid = l.id
                                            INNER JOIN federation f on l.federationid = f.id
                                            INNER JOIN administrator_federation af on f.id = af.federationid
                                   WHERE af.administratoruid = $1`, [administrator.uid]);
    return result.rows.map(p => p.uid);
  }

  static async validationSportClubLeague(clubId: number, leagueId: number) {
    const result = await DB.query(`SELECT f.id
                                   FROM federation f
                                            INNER JOIN league l on f.id = l.federationid
                                            INNER JOIN club c on f.sportid = c.sportid
                                   WHERE c.id = $1
                                     AND l.id = $2
                                   LIMIT 1;`, [clubId, leagueId]);
    return result.rows.length == 1;
  }

  static async validationGame(championshipId: number, teamAId: number, teamBId: number) {
    const result = await DB.query(`
        SELECT c.id
        FROM championship c
                 INNER JOIN league l on l.id = c.leagueid
                 INNER JOIN team ta on l.id = c.leagueid
                 INNER JOIN team tb on l.id = c.leagueid
        WHERE c.id = $1
          AND ta.id = $2
          AND tb.id = $3
        LIMIT 1;`, [championshipId, teamAId, teamBId]);
    return result.rows.length == 1;
  }
}
