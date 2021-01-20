import pg from "pg";

const config: pg.ClientConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};
export const PoolClient = () => new pg.Pool(config).connect();
export default new pg.Client(config);

PoolClient().then(async client => {
  const result = await client.query(``);
  result.rows.join();
});
