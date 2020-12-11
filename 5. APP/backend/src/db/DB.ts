import pg from "pg";

export default new pg.Client({
  host: "studimax-cloud.ch",
  port: 5431,
  user: "postgres",
  password: "root",
  database: "bdr_proj_crausaz_scharwath"
});
