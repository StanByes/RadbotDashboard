import { load } from "ts-dotenv";

const env = load({
    APP_URL: String,
    PORT: Number,

    CLIENT_ID: String,
    CLIENT_SECRET: String,

    NODE_ENV: String
});

export default env;