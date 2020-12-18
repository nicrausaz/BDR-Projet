import DB from "../db/DB";
import Administrator from "../models/Administrator";
import Pagination from "../models/Pagination";
import Model from "../models/Model";

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

  static async totalRows(tableName: string): Promise<number> {
    return (await DB.query(`
        SELECT count(*) as total
        FROM ${tableName}
    `)).rows[0]?.total;
  }

  static async createSearchPaginate<T extends typeof Model>(model: T, tableName: string, sql: string, query: string, limit: number, offset: number) {
    const result = await DB.query(`
        ${sql}
        LIMIT $2 OFFSET $3
    `, [`%${query}%`, limit, offset]);

    return Pagination.create(
      result.rows.map(r => model.hydrate(r)),
      await Utils.totalRows(tableName),
      limit,
      offset
    );
  }

  static async createSimpleSearchPaginate<T extends typeof Model>(model: T, tableName: string, attributes: string[], query: string, limit: number, offset: number) {
    const result = await DB.query(`
        SELECT *
        FROM ${tableName}
        ${attributes.map((attribute, index) => `${(index > 0) ? "OR" : "WHERE"} ${attribute} ILIKE $1`).join("\n")}
        LIMIT $2 OFFSET $3
    `, [`%${query}%`, limit, offset]);

    return Pagination.create(
      result.rows.map(r => model.hydrate(r)),
      await Utils.totalRows(tableName),
      limit,
      offset
    );
  }
}
