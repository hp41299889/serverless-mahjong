import dayjs from "dayjs";

import { checkRedis, redisClient } from "@/lib/redis/redis";
import { roundModel } from "@/pages/api/round/model";
import {
  AddRecord,
  CurrentRound,
  History,
  Statistics,
  WindStatistics,
} from "./interface";
import { addRecord, generateCurrentRound, updateCurrentRound } from "./mahjong";
import { Round } from "@/pages/api/round/interface";

const STATISTICS = "statistics";
const HISTORY = "history";

export const getStatistics = async () => {
  await checkRedis();
  return JSON.parse((await redisClient.get(STATISTICS)) as string);
};

export const getHistory = async () => {
  await checkRedis();
  return JSON.parse((await redisClient.get(HISTORY)) as string);
};

export const setStatistics = async (statistics: Statistics) => {
  await checkRedis();
  redisClient.set(STATISTICS, JSON.stringify(statistics));
};

export const setHistory = async (history: History) => {
  await checkRedis();
  redisClient.set(HISTORY, JSON.stringify(history));
};

export const initStatistics = async () => {
  await checkRedis();
  const statistics: Statistics = {};
  const history: History = {};
  const rounds = await roundModel.readAll();
  for (const round of rounds) {
    const { records } = round;
    let tempRound = generateCurrentRound(round);
    for (const record of records) {
      const { circle, dealer, dealerCount } = tempRound;
      const { winner, losers, point, endType, createdAt } = record;
      const addRecordDto: AddRecord = {
        circle: circle,
        dealer: dealer,
        dealerCount: dealerCount,
        winner: winner ? winner.name : "",
        losers:
          losers.length > 0
            ? losers.map((loser) => (loser.name ? loser.name : ""))
            : [],
        point: point,
        endType: endType,
        createdAt: createdAt,
      };

      const addedCurrentRound = await addRecord(tempRound, addRecordDto);
      tempRound = await updateCurrentRound(addedCurrentRound, addRecordDto);
    }

    const updatedStatistics = await updateStatistics(statistics, tempRound);
    const updatedHistory = await updateHistory(history, tempRound);
    await setStatistics(updatedStatistics);
    await setHistory(updatedHistory);
  }
};

export const updateStatistics = async (
  statistics: Statistics,
  tempRound: CurrentRound
) => {
  await checkRedis();
  const { players, records } = tempRound;
  if (statistics === null) {
    statistics = {};
  }

  Object.keys(players).forEach(async (wind) => {
    const player = players[wind];
    const { id, name, win, lose, selfDrawn, beSelfDrawn, draw, fake, amount } =
      player;

    if (!statistics[name]) {
      statistics[name] = {
        id,
        name,
        winds: {
          east: {
            round: 0,
            record: 0,
            win: 0,
            lose: 0,
            selfDrawn: 0,
            draw: 0,
            beSelfDrawn: 0,
            fake: 0,
            amount: 0,
          },
          south: {
            round: 0,
            record: 0,
            win: 0,
            lose: 0,
            selfDrawn: 0,
            draw: 0,
            beSelfDrawn: 0,
            fake: 0,
            amount: 0,
          },
          west: {
            round: 0,
            record: 0,
            win: 0,
            lose: 0,
            selfDrawn: 0,
            draw: 0,
            beSelfDrawn: 0,
            fake: 0,
            amount: 0,
          },
          north: {
            round: 0,
            record: 0,
            win: 0,
            lose: 0,
            selfDrawn: 0,
            draw: 0,
            beSelfDrawn: 0,
            fake: 0,
            amount: 0,
          },
        },
      };
    }

    statistics[name].winds[wind] = await updateOrCreateWindStatistics(
      statistics[name].winds[wind],
      records.length,
      {
        win,
        lose,
        selfDrawn,
        beSelfDrawn,
        draw,
        fake,
        amount,
      }
    );
  });

  return statistics;
};

const updateOrCreateWindStatistics = async (
  stats: WindStatistics,
  recordsLength: number,
  data: Partial<WindStatistics>
): Promise<WindStatistics> => {
  await checkRedis();
  stats.round++;
  stats.record += recordsLength;
  stats.win += data.win || 0;
  stats.lose += data.lose || 0;
  stats.selfDrawn += data.selfDrawn || 0;
  stats.beSelfDrawn += data.beSelfDrawn || 0;
  stats.draw += data.draw || 0;
  stats.fake += data.fake || 0;
  stats.amount += data.amount || 0;

  return stats;
};

export const updateHistory = async (
  history: History,
  tempRound: CurrentRound
) => {
  await checkRedis();
  const { round, players, records, venue } = tempRound;
  const { uid, base, point, createdAt, deskType } = round as Round;
  const { east, south, west, north } = players;
  const date = dayjs(createdAt).format("YYYY-MM-DD");
  if (history === null) {
    history = {};
  }
  if (!history[date]) {
    history[date] = [];
  }
  history[date].push({
    uid: uid,
    deskType: deskType,
    base: base,
    point: point,
    createdAt: new Date(createdAt),
    east: east,
    south: south,
    west: west,
    north: north,
    records: records,
    venue: venue,
  });
  return history;
};
