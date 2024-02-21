import { DataSource } from "typeorm";
import { env } from "../config/config";
import path from "path";
export const mysqlDataSource = new DataSource({
  type: "mysql",
  host: env.mysql.host,
  port: env.mysql.port,
  username: env.mysql.user,
  password: env.mysql.password,
  database: env.mysql.schema,
  entities: [path.join(__dirname, "../entities/*{.js,.ts}")],
  migrations: [path.join(__dirname, "../migrations/*{.js,.ts}")],
  synchronize: true,
  timezone: "+00:00",
});
