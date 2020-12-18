import pg from "pg";

const config: pg.ClientConfig = {
  host: "studimax-cloud.ch",
  port: 5431,
  user: "postgres",
  password: "root",
  database: "bdr_proj_crausaz_scharwath"
};
export const Pool = new pg.Pool(config);
export default new pg.Client(config);
