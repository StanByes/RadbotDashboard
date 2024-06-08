import { createPool } from "mysql2/promise";
import env from "../env";

const databasePool = createPool({
    timezone: "Europe/Paris",
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASS,
    database: env.MYSQL_DB
});

export default databasePool;