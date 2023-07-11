import { RedisClientType, createClient } from "redis";
import "dotenv/config";
import { initStatistics } from "@/job/mahjong/statistics";
import { initCurrentRound } from "@/job/mahjong/mahjong";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

export const checkRedis = async () => {
  if (!redisClient.isReady) {
    await redisClient.connect();
    await initStatistics();
    await initCurrentRound();
  }
};
