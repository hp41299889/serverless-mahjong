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

export const getRedis = async () => {
  if (!redisClient) {
    await initStatistics();
    await initCurrentRound();
  }
  return redisClient;
};

export const redisConnect = async () => {
  await redisClient.connect();
};

export const redisDisConnect = async () => {
  await redisClient.disconnect();
};
