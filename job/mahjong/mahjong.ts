import {
  EndType,
  Wind,
  CreateOneRecordDto,
} from "@/pages/api/record/interface";
import { recordModel } from "@/pages/api/record/model";
import { RoundStatus } from "@/pages/api/round/interface";
import { roundModel } from "@/pages/api/round/model";
import { Round } from "@/pages/api/round/interface";
import { checkRedis, redisClient } from "@/lib/redis/redis";
import { CurrentRound, AddRecord, PlayerScore } from "./interface";
import { Player } from "@/pages/api/player/interface";

const CURRENTROUND = "currentRound";

export const getCurrentRoundState = async (): Promise<CurrentRound> => {
  await checkRedis();
  return JSON.parse((await redisClient.get(CURRENTROUND)) as string);
};

export const setCurrentRoundState = async (currentRound: CurrentRound) => {
  await checkRedis();
  redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

export const initCurrentRound = async () => {
  await checkRedis();
  await resetCurrentRound();
  const lastRound = await roundModel.readLastWithPlayers();
  if (lastRound) {
    if (!(await checkRound(lastRound))) {
      const currentRound = generateCurrentRound(lastRound);
      await setCurrentRoundState(currentRound);
    }
  }
};

export const addRecord = async (
  currentRound: CurrentRound,
  addRecordDto: AddRecord
) => {
  currentRound.records = [...currentRound.records, addRecordDto];
  await calculateScore(currentRound, addRecordDto);
  return currentRound;
};

export const removeLastRecord = async (currentRound: CurrentRound) => {
  const lastRecord = currentRound.records[currentRound.records.length - 1];
  await recoverScore(currentRound, lastRecord);
  currentRound.records.pop();
  return currentRound;
};

export const updateCurrentRound = async (
  currentRound: CurrentRound,
  addRecordDto: AddRecord
) => {
  const { dealer, circle } = currentRound;
  if (isDealerContinue(currentRound, addRecordDto)) {
    currentRound.dealerCount++;
  } else {
    currentRound.dealerCount = 0;
    if (dealer === Wind.NORTH) {
      if (circle === Wind.NORTH) {
        const checkedVenue = await checkVenue(currentRound);
        const endedCurrentRound: CurrentRound = {
          ...checkedVenue,
          status: RoundStatus.END,
        };
        return endedCurrentRound;
      } else {
        const nextCircle = updateWind(circle);
        currentRound.circle = nextCircle;
      }
    }
    const nextDealer = updateWind(dealer);
    currentRound.dealer = nextDealer;
  }
  return currentRound;
};

export const recoverCurrentRound = async (
  currentRound: CurrentRound,
  removed: AddRecord
) => {
  const { status } = currentRound;
  if (status === RoundStatus.END) {
    currentRound.status = RoundStatus.IN_PROGRESS;
  }
  currentRound.circle = removed.circle;
  currentRound.dealer = removed.dealer;
  currentRound.dealerCount = removed.dealerCount;
  return currentRound;
};

export const saveRecords = async (currentRound: CurrentRound) => {
  const { records, round } = currentRound;
  const { east, south, west, north } = round as Round;
  const players = {
    east: east,
    south: south,
    west: west,
    north: north,
  };
  const savePromise = records.map(async (record) => {
    const { winner, losers, point, endType, createdAt } = record;
    const winnerPlayer = Object.values(players).find(
      (player) => player.name === winner
    );
    const loserPlayers = Object.values(players).filter((player) =>
      losers.includes(player.name)
    );
    const dto: CreateOneRecordDto = {
      round: round as Round,
      winner: winnerPlayer as Player,
      losers: loserPlayers,
      endType: endType,
      point: point,
      createdAt: createdAt,
    };
    await recordModel.createOne(dto);
  });
  await Promise.all(savePromise);
};

export const resetCurrentRound = async () => {
  const emptyPlayerScore: PlayerScore = {
    id: 0,
    name: "",
    win: 0,
    lose: 0,
    selfDrawn: 0,
    beSelfDrawn: 0,
    draw: 0,
    fake: 0,
    amount: 0,
  };
  const currentRound: CurrentRound = {
    status: RoundStatus.EMPTY,
    round: null,
    records: [],
    circle: Wind.EAST,
    dealer: Wind.EAST,
    dealerCount: 0,
    venue: [],
    players: {
      east: { ...emptyPlayerScore },
      south: { ...emptyPlayerScore },
      west: { ...emptyPlayerScore },
      north: { ...emptyPlayerScore },
    },
  };
  redisClient.set(CURRENTROUND, JSON.stringify(currentRound));
};

export const generateCurrentRound = (round: Round) => {
  const { east, south, west, north } = round;
  const emptyPlayer = {
    win: 0,
    lose: 0,
    selfDrawn: 0,
    beSelfDrawn: 0,
    draw: 0,
    fake: 0,
    amount: 0,
  };
  const currentRound: CurrentRound = {
    status: RoundStatus.IN_PROGRESS,
    round: round,
    records: [],
    circle: Wind.EAST,
    dealer: Wind.EAST,
    dealerCount: 0,
    venue: [],
    players: {
      east: { ...east, ...emptyPlayer },
      south: { ...south, ...emptyPlayer },
      west: { ...west, ...emptyPlayer },
      north: { ...north, ...emptyPlayer },
    },
  };
  return currentRound;
};

const checkVenue = async (currentRound: CurrentRound) => {
  const { venue, records, players } = currentRound;
  if (venue.length !== 4) {
    const diff = 4 - venue.length;
    const reversedRecords = records.slice().reverse();
    for (let i = 0; i < diff; i++) {
      const index = reversedRecords.findIndex(
        (record) =>
          record.endType === EndType.WINNING &&
          !isDealerWin(currentRound, record.winner)
      );
      const target = reversedRecords.splice(index, 1)[0];
      const { winner } = target;
      const winnerWind = getPlayerWind(currentRound, winner) as string;
      players[winnerWind].amount -= 50;
      venue.push(target);
    }
  }
  return currentRound;
};

const checkRound = async (round: Round) => {
  return round.records.length > 1;
};

const calculateScore = async (
  currentRound: CurrentRound,
  addRecordDto: AddRecord
) => {
  const { round, dealer, dealerCount, players } = currentRound;
  const { winner, losers, endType, point } = addRecordDto;
  if (round) {
    switch (endType) {
      case EndType.WINNING: {
        const winnerWind = getPlayerWind(currentRound, winner) as string;
        const loserWind = getPlayerWind(currentRound, losers[0]) as string;
        players[winnerWind].win++;
        players[loserWind].lose++;
        players[winnerWind].amount += round.base + round.point * point;
        players[loserWind].amount -= round.base + round.point * point;
        break;
      }
      case EndType.SELF_DRAWN: {
        const winnerWind = getPlayerWind(currentRound, winner) as string;
        currentRound.players[winnerWind].selfDrawn++;
        if (isDealer(winnerWind, dealer)) {
          const loserWindPromise = losers.map(async (loser) => {
            const loserWind = getPlayerWind(currentRound, loser) as string;
            players[winnerWind].amount += round.base + round.point * point;
            players[loserWind].amount -= round.base + round.point * point;
            players[loserWind].beSelfDrawn++;
          });
          await Promise.all(loserWindPromise);
        } else {
          const loserWindPromise = losers.map(async (loser) => {
            const loserWind = getPlayerWind(currentRound, loser) as string;
            const dealerPoints = isDealer(loserWind, dealer)
              ? dealerCount * 2 + 1
              : 0;
            const totalPoints = point + dealerPoints;
            players[winnerWind].amount +=
              round.base + round.point * totalPoints;
            players[loserWind].amount -= round.base + round.point * totalPoints;
            players[loserWind].beSelfDrawn++;
          });
          await Promise.all(loserWindPromise);
        }
        await calculateVenue(currentRound, addRecordDto);
        break;
      }
      case EndType.DRAW: {
        const keyPromise = Object.keys(players).map(async (key) => {
          players[key].draw++;
        });
        await Promise.all(keyPromise);
        break;
      }
      case EndType.FAKE: {
        break;
      }
    }
  }
  return currentRound;
};

const recoverScore = async (currentRound: CurrentRound, removed: AddRecord) => {
  const { round, dealer, dealerCount, players, venue } = currentRound;
  const { winner, losers, endType, point } = removed;
  if (round) {
    switch (endType) {
      case EndType.WINNING: {
        const winnerWind = getPlayerWind(currentRound, winner) as string;
        const loserWind = getPlayerWind(currentRound, losers[0]) as string;
        players[winnerWind].win--;
        players[loserWind].lose--;
        players[winnerWind].amount -= round.base + round.point * point;
        players[loserWind].amount += round.base + round.point * point;
        break;
      }
      case EndType.SELF_DRAWN: {
        await recoverVenue(currentRound, removed);
        const winnerWind = getPlayerWind(currentRound, winner) as string;
        currentRound.players[winnerWind].selfDrawn--;
        if (isDealer(winnerWind, dealer)) {
          const loserWindPromise = losers.map(async (loser) => {
            const loserWind = getPlayerWind(currentRound, loser) as string;
            players[winnerWind].amount -= round.base + round.point * point;
            players[loserWind].amount += round.base + round.point * point;
            players[loserWind].beSelfDrawn--;
          });
          await Promise.all(loserWindPromise);
        } else {
          const loserWindPromise = losers.map(async (loser) => {
            const loserWind = getPlayerWind(currentRound, loser) as string;
            const dealerPoints = isDealer(loserWind, dealer)
              ? dealerCount * 2 + 1
              : 0;
            const totalPoints = point + dealerPoints;
            players[winnerWind].amount -=
              round.base + round.point * totalPoints;
            players[loserWind].amount += round.base + round.point * totalPoints;
            players[loserWind].beSelfDrawn--;
          });
          await Promise.all(loserWindPromise);
        }
        break;
      }
      case EndType.DRAW: {
        const keyPromise = Object.keys(players).map(async (key) => {
          players[key].draw--;
        });
        await Promise.all(keyPromise);
        break;
      }
      case EndType.FAKE: {
        break;
      }
    }
  }
  return currentRound;
};

const calculateVenue = async (
  currentRound: CurrentRound,
  addRecordDto: AddRecord
) => {
  const { venue, players } = currentRound;
  const { winner } = addRecordDto;
  const winnerWind = getPlayerWind(currentRound, winner);
  if (winnerWind) {
    if (venue.length < 4) {
      venue.push(addRecordDto);
      players[winnerWind].amount -= 50;
    }
  }
};

const recoverVenue = async (currentRound: CurrentRound, removed: AddRecord) => {
  const { venue, players } = currentRound;
  const { winner } = removed;
  const winnerWind = getPlayerWind(currentRound, winner) as string;
  if (venue[venue.length - 1].createdAt === removed.createdAt) {
    players[winnerWind].amount += 50;
    venue.pop();
  }
};

const isDealer = (wind: string, dealer: string) => {
  return wind === dealer;
};

const isDealerContinue = (
  currentRound: CurrentRound,
  addRecordDto: AddRecord
) => {
  return (
    isDealerWin(currentRound, addRecordDto.winner) ||
    isDraw(addRecordDto.endType) ||
    isFake(addRecordDto.endType)
  );
};

const isDealerWin = (currentRound: CurrentRound, winnerName: string) => {
  return winnerName
    ? currentRound.dealer === getPlayerWind(currentRound, winnerName)
    : false;
};

const isDraw = (endType: EndType) => {
  return endType === EndType.DRAW;
};

const isFake = (endType: EndType) => {
  return endType === EndType.FAKE;
};

const getPlayerWind = (currentRound: CurrentRound, name: string) => {
  const playerEntry =
    name &&
    Object.entries(currentRound.players).find(
      ([key, value]) => value.name === name
    );

  return playerEntry ? playerEntry[0] : null;
};

const updateWind = (currentWind: Wind) => {
  switch (currentWind) {
    case Wind.EAST:
      return Wind.SOUTH;
    case Wind.SOUTH:
      return Wind.WEST;
    case Wind.WEST:
      return Wind.NORTH;
    case Wind.NORTH:
      return Wind.EAST;
  }
};
