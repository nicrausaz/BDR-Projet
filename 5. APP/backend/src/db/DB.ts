import pg from "pg";

const config: pg.ClientConfig = {
  host: "studimax-cloud.ch",
  port: 5431,
  user: "postgres",
  password: "root",
  database: "bdr_proj_crausaz_scharwath"
};
export const PoolClient = () => new pg.Pool(config).connect();
export default new pg.Client(config);

PoolClient().then(async client=>{
  const result = await client.query(``);
  result.rows.join()
})
