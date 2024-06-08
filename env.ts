import { load } from "ts-dotenv";

const env = load({
    APP_URL: String,
    PORT: Number,
    SESSION_SECRET: String,

    CLIENT_ID: String,
    CLIENT_SECRET: String,

    NODE_ENV: String,

    MYSQL_HOST: String,
    MYSQL_PORT: Number,
    MYSQL_USER: String,
    MYSQL_PASS: String,
    MYSQL_DB: String,

    REDIS_HOST: String,
    REDIS_PORT: Number,
    REDIS_CHANNEL: String,
});

export default env;