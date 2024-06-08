import { createClient } from "redis";
import env from "../env";

const redisConnection = createClient({
    url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`
});
redisConnection.connect();

export function publishMessage(message: string) {
    redisConnection.publish(env.REDIS_CHANNEL, message);
}