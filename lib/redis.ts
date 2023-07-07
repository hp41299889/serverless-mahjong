import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

export const redisConnect = async () => {
  await redis.connect();
};
