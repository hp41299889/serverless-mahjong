import { mahjongApi } from "@/util/http/request";
import { PostPlayer, PostRecord, PostRound } from "./interface";

// player
export const getAllPlayers = async () => {
  return await mahjongApi.get("/player");
};

export const postPlayer = async (data: PostPlayer) => {
  return await mahjongApi.post("/player", data);
};

export const getPlayerStatistics = async () => {
  return await mahjongApi.get("/player/statistics");
};

// round

export const postRound = async (data: PostRound) => {
  return await mahjongApi.post("/round", data);
};

export const getCurrentRound = async () => {
  return await mahjongApi.get("/round/currentRound");
};

export const postResetCurrentRound = async () => {
  return await mahjongApi.post("/round/currentRound");
};

export const deleteCurrentRound = async () => {
  return await mahjongApi.delete("/round/currentRound");
};

export const getExistDate = async () => {
  return await mahjongApi.get("/round/history/existDates");
};

export const getHistoryByDate = async (date: string) => {
  return await mahjongApi.get(`/round/history/${date}`);
};

// record
export const postRecord = async (data: PostRecord) => {
  return await mahjongApi.post("/record", data);
};

export const deleteLastRecord = async () => {
  return await mahjongApi.delete("/record");
};
